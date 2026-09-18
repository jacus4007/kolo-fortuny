const SUPABASE_URL = "https://xytobyfvnrrbirmbwhba.supabase.co";
const SUPABASE_KEY = "sb_publishable_NJVRAZmxlHBgCuMN2eDeEQ_kVoON1lq";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const wheel = document.getElementById("wheel");
const spinButton = document.getElementById("spinButton");
const resultBox = document.getElementById("result");
const historyBody = document.getElementById("historyBody");

const amounts = [40, 45, 50, 60, 70, 80, 100, 140, 200];

let spinning = false;
let currentRotation = 0;

// Pobieramy token z adresu strony
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

// ==========================
// HISTORIA
// ==========================

async function loadHistory() {
    historyBody.innerHTML =
        "<tr><td colspan='3'>Ładowanie historii...</td></tr>";

    const { data, error } = await supabaseClient.rpc(
        "get_spin_history"
    );

    if (error) {
        console.error(error);

        historyBody.innerHTML =
            "<tr><td colspan='3'>Nie udało się pobrać historii.</td></tr>";

        return;
    }

    if (!data || data.length === 0) {
        historyBody.innerHTML =
            "<tr><td colspan='3'>Brak historii.</td></tr>";

        return;
    }

    historyBody.innerHTML = data.map(row => `
        <tr>
            <td>${row.person_name ?? "-"}</td>
            <td>${row.result} zł</td>
            <td>${new Date(row.created_at).toLocaleDateString("pl-PL")}</td>
        </tr>
    `).join("");
}

// ==========================
// SPRAWDZENIE LINKU
// ==========================

async function checkToken() {

    if (!token) {
        spinButton.disabled = true;

        resultBox.textContent =
            "Ten link nie zawiera prawidłowego kodu.";

        return;
    }

    const { data, error } = await supabaseClient.rpc(
        "get_spin_result",
        {
            p_token: token
        }
    );

    if (error) {
        console.error(error);

        spinButton.disabled = true;

        resultBox.textContent =
            "Nie udało się sprawdzić linku.";

        return;
    }

    if (!data || data.length === 0) {
        spinButton.disabled = true;

        resultBox.textContent =
            "Ten link nie istnieje.";

        return;
    }

    const savedResult = data[0].result;
    const used = data[0].used;

    if (used) {
        spinButton.disabled = true;

        resultBox.textContent =
            `Ten link został już wykorzystany. Wynik: ${savedResult} zł`;

        return;
    }

    spinButton.disabled = false;
}

// ==========================
// LOSOWANIE
// ==========================

async function spinWheel() {

    if (spinning || !token) {
        return;
    }

    spinning = true;
    spinButton.disabled = true;
    resultBox.textContent = "Losowanie...";

    const { data, error } = await supabaseClient.rpc(
        "spin_wheel",
        {
            p_token: token
        }
    );

    if (error) {
        console.error(error);

        resultBox.textContent =
            "Nie udało się wykonać losowania.";

        spinning = false;

        await checkToken();

        return;
    }

    const result = Number(data);

    const index = amounts.indexOf(result);

    if (index === -1) {
        resultBox.textContent =
            `Wynik: ${result} zł`;

        spinning = false;

        return;
    }

    // Środek odpowiedniego pola
    const segmentCenter = index * 40 + 20;

    // Wskaźnik znajduje się na górze koła
    const targetAngle = 270 - segmentCenter;

    // Kilka pełnych obrotów + ustawienie właściwego pola
    const extraSpins = 5 * 360;

    currentRotation += extraSpins + targetAngle - (currentRotation % 360);

    wheel.style.transform =
        `rotate(${currentRotation}deg)`;

    // Czekamy aż animacja się skończy
    setTimeout(() => {

        resultBox.textContent =
            `🎉 Wygrałaś ${result} zł!`;

        spinning = false;

        loadHistory();

    }, 4000);
}

// ==========================
// START
// ==========================

spinButton.addEventListener("click", spinWheel);

loadHistory();
checkToken();
