const SUPABASE_URL = "https://xytobyfvnrrbirmbwhba.supabase.co";
const SUPABASE_KEY = "sb_publishable_NJVRAZmxlHBgCuMN2eDeEQ_kVoON1lq";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const personName = document.getElementById("personName");
const generateButton = document.getElementById("generateButton");
const generatedLink = document.getElementById("generatedLink");

generateButton.addEventListener("click", async function () {

    const name = personName.value.trim();

    if (!name) {
        generatedLink.textContent = "Wpisz imię osoby.";
        return;
    }

    generateButton.disabled = true;
    generatedLink.textContent = "Generowanie linku...";

    const { data, error } = await supabaseClient.rpc(
        "create_spin_link",
        {
            p_person_name: name
        }
    );

    if (error) {
        console.error(error);

        generatedLink.textContent =
            "Nie udało się utworzyć linku.";

        generateButton.disabled = false;
        return;
    }

    const token = data[0].token;

    const link =
        window.location.origin +
        "/kolo-fortuny/?token=" +
        token;

    generatedLink.innerHTML =
        "<p>Link dla <strong>" +
        name +
        "</strong>:</p>" +

        "<input type='text' value='" +
        link +
        "' readonly id='linkInput'>" +

        "<button id='copyButton'>KOPIUJ LINK</button>";

    document.getElementById("copyButton").addEventListener(
        "click",
        async function () {

            await navigator.clipboard.writeText(link);

            document.getElementById("copyButton").textContent =
                "SKOPIOWANO ✓";
        }
    );

    personName.value = "";
    generateButton.disabled = false;
});
async function loadHistory() {

    const historyBody = document.getElementById("historyBody");

    if (!historyBody) {
        return;
    }

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
            <td>${new Date(row.created_at).toLocaleString("pl-PL")}</td>
        </tr>
    `).join("");
}

loadHistory();
