const SUPABASE_URL = "https://xytobyfvnrrbirmbwhba.supabase.co";
const SUPABASE_KEY = "sb_publishable_NJVRAZmxlHBgCuMN2eDeEQ_kVoON1lq";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const historyBody = document.getElementById("historyBody");

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

loadHistory();
