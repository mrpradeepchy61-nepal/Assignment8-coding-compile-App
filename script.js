function compileCode() {
  const code = document.getElementById("code").value;
  const langId = document.getElementById("language").value;
  const outputBox = document.getElementById("output");

  outputBox.innerText = "Compiling...";

  fetch("https://codequotient.com/api/executeCode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code: code,
      langId: langId
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        outputBox.innerText = "ERROR:\n" + data.error;
        return;
      }

      const codeId = data.codeId;

      const interval = setInterval(() => {
        fetch(`https://codequotient.com/api/codeResult/${codeId}`)
          .then(res => res.json())
          .then(resultData => {
            if (!resultData.data || resultData.data === "{}") {
              return;
            }

            clearInterval(interval);

            const result = JSON.parse(resultData.data);

            if (result.errors) {
              outputBox.innerText = "ERROR:\n" + result.errors;
            } else {
              outputBox.innerText = "OUTPUT:\n" + result.output;
            }
          });
      }, 2000);
    })
    .catch(error => {
      outputBox.innerText =
        "Network error or API problem!\n\nPossible reasons:\n1. API blocked by browser CORS\n2. Internet issue\n3. CodeQuotient API not responding\n4. You opened file directly without Live Server";
    });
}