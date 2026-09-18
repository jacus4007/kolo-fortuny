const historyBody = document.getElementById("historyBody");

async function loadHistory() {
    historyBody.innerHTML = "<tr><td colspan='3'>Ładowanie historii...</td></tr>";

    // Na tym etapie przygotowujemy miejsce na połączenie z Supabase.
    // Po dodaniu klucza i adresu projektu pobierzemy tutaj prawdziwą historię.

    historyBody.innerHTML = `
        <tr>
            <td>Ania</td>
            <td>60 zł</td>
            <td>18.09.2026</td>
        </tr>
    `;
}

loadHistory();
