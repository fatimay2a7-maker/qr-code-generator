const form = document.querySelector("#qr-form");
const input = document.querySelector("#qr-input");
const qrContainer = document.querySelector("#qrcode");
const message = document.querySelector("#message");
const downloadButton = document.querySelector("#download-btn");
const shareButton = document.querySelector("#share-btn");

let currentText = input.value;
let qrCode;

function generateQr(text) {
  const value = text.trim();

  if (!value) {
    message.textContent = "Please enter some text or a URL first.";
    input.focus();
    return;
  }

  qrContainer.innerHTML = "";
  qrCode = new QRCode(qrContainer, {
    text: value,
    width: 152,
    height: 152,
    colorDark: "#11172b",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  currentText = value;
  message.textContent = "Your QR code is ready!";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateQr(input.value);
});

downloadButton.addEventListener("click", () => {
  const canvas = qrContainer.querySelector("canvas");
  const image = qrContainer.querySelector("img");
  const dataUrl = canvas ? canvas.toDataURL("image/png") : image?.src;

  if (!dataUrl) {
    message.textContent = "Generate a QR code before downloading.";
    return;
  }

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "qr-code.png";
  link.click();
});

shareButton.addEventListener("click", async () => {
  if (!currentText) return;

  try {
    if (navigator.share) {
      await navigator.share({ title: "QR Code", text: currentText });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(currentText);
      message.textContent = "Text copied to clipboard.";
    } else {
      message.textContent = "Sharing is not supported in this browser.";
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      message.textContent = "Could not share. Try copying the text instead.";
    }
  }
});

generateQr(currentText);
