const SUPABASE_URL = "https://xytobyfvnrrbirmbwhba.supabase.co";
const SUPABASE_KEY = "
  xytobyfvnrrbirmbwhba";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const personName = document.getElementById("personName");
const generateButton = document.getElementById("generateButton");
const generatedLink = document.getElementById("generatedLink");

generateButton.addEventListener("click", async () => {

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
        `${window.location.origin}/kolo-fortuny/?token=${token}`;

    generatedLink.innerHTML = `
        <p>Link dla <strong>${name}</strong>:</p>

        <input
            type="text"
            value="${link}"
            readonly
            id="linkInput"
        >

        <button id="copyButton">
            KOPIUJ LINK
        </button>
    `;

    document.getElementById("copyButton").addEventListener("click", async () => {

        await navigator.clipboard.writeText(link);

        document.getElementById("copyButton").textContent =
            "SKOPIOWANO ✓";
    });

    personName.value = "";
    generateButton.disabled = false;
});
