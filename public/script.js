
// 🚀 Navigation Setup
let currentSection = 1;
const totalSections = 6;
const stageTitles = [
  "Section 1: Company / Business Information",
  "Section 2: Owner / Director / Legal Representative",
  "Section 3: Smart Invoice Solution Required",
  "Section 4: Addition of Branches",
  "Section 5: Integration and Certification",
  "Section 6: Commitment by Taxpayer"
];

// 🎯 Navigation Handlers
function nextSection() {
  if (currentSection === 3) {
    const selected = document.querySelector('input[name="solution"]:checked');
    if (!selected) {
      alert("Please select one invoicing solution to proceed.");
      return;
}
}
  if (currentSection < totalSections) {
    toggleSection(currentSection, currentSection + 1);
    currentSection++;
}
}
function previousSection() {
  if (currentSection> 1) {
    toggleSection(currentSection, currentSection - 1);
    currentSection--;
}
}
function toggleSection(from, to) {
  document.getElementById(`section${from}`).classList.remove("active");
  document.getElementById(`section${to}`).classList.add("active");
  updateProgressBar(to);
  updateStageTitle(to);
  monitorValidation();
}
function updateStageTitle(index) {
  const title = document.getElementById("stageTitle");
  if (!title) return;
  title.style.opacity = 0;
  title.textContent = stageTitles[index - 1];
  setTimeout(() => { title.style.opacity = 1;}, 250);
}
function updateProgressBar(sectionNum) {
  const steps = document.querySelectorAll("#progressSteps li");
  steps.forEach((step, index) => {
    step.classList.remove("current", "completed");
    if (index + 1 < sectionNum) step.classList.add("completed");
    else if (index + 1 === sectionNum) step.classList.add("current");
});
}

// ✅ Field Validation
function updateNextButtonState() {
  const section = document.querySelector(`#section${currentSection}`);
  if (!section) return;
  const requiredFields = section.querySelectorAll("input[required], select[required], textarea[required]");
  let isValid = true;
  requiredFields.forEach(field => {
    if (field.type === "radio") {
      const selected = section.querySelector(`input[name="${field.name}"]:checked`);
      if (!selected) isValid = false;
} else if (field.value.trim() === "") {
      isValid = false;
}
});
  if (currentSection === 3) {
    const selected = section.querySelector('input[name="solution"]:checked');
    if (!selected) isValid = false;
}
  const nextBtn = section.querySelector(".btn-primary");
  if (nextBtn) nextBtn.disabled =!isValid;
}
function monitorValidation() {
  const section = document.querySelector(`#section${currentSection}`);
  if (!section) return;
  const inputs = section.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    input.addEventListener("input", updateNextButtonState);
    input.addEventListener("change", updateNextButtonState);
});
  updateNextButtonState();
}

// 💾 Autosave Inputs
document.querySelectorAll('#taxInvoiceForm input, #taxInvoiceForm select, #taxInvoiceForm textarea').forEach(field => {
  const key = field.name;
  const saved = localStorage.getItem(key);
  if (saved) field.value = saved;
  field.addEventListener("input", () => {
    localStorage.setItem(key, field.value);
    updateNextButtonState();
});
});

// 🔄 Autosave Radio Tiles
document.querySelectorAll('input[name="solution"]').forEach(radio => {
  const saved = localStorage.getItem("solution");
  if (saved && radio.value === saved) radio.checked = true;
  radio.addEventListener("change", () => {
 localStorage.setItem("solution", radio.value);
    updateNextButtonState();
    highlightSelectedTile();
});
});
function highlightSelectedTile() {
  document.querySelectorAll('.tile-option').forEach(tile => tile.classList.remove('selected'));
  const selected = document.querySelector('input[name="solution"]:checked');
  if (selected) selected.closest('.tile-option')?.classList.add('selected');
}

// 🔍 TPIN Lookup (Mock)
function fetchTPINData(tpin) {
  const mockData = {
    "123456789": {
      business_name: "ZamTech Solutions",
      plot_no: "12B",
      street_name: "Freedom Ave",
      town: "Lusaka",
      country: "Zambia",
      business_email1: "info@zamtech.co.zm",
      business_mobile1: "+260971234567"
}
};
  const data = mockData[tpin];
  if (data) {
    for (const key in data) {
      const field = document.querySelector(`[name="${key}"]`);
      if (field) field.value = data[key];
}
    alert("TPIN data loaded.");
    updateNextButtonState();
} else {
    alert("TPIN not found.");
}
  localStorage.setItem("business_tpin", tpin);
}

// 📝 SignaturePad Setup
let signaturePad;
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("signaturePad");
  signaturePad = new SignaturePad(canvas);
});
function clearSignature() {
  signaturePad.clear();
}
function updateDisclaimerName(name) {
  document.getElementById("disclaimer-name").textContent = name || "Your Full Name";
  const echoField = document.getElementById("nameEcho");
  if (echoField) echoField.value = name;
}
document.getElementById("signature_name")?.addEventListener("input", function () {
  updateDisclaimerName(this.value.trim());
});

// 📦 Appendix A Modal
function openAppendixModal() {
  document.getElementById("appendixAModal").style.display = "flex";
}
function closeAppendixModal() {
  document.getElementById("appendixAModal").style.display = "none";
}
document.getElementById("addBranchCheckbox")?.addEventListener("change", function () {
  if (this.checked) openAppendixModal();
});
function submitBranch() {
  setTimeout(() => {
    showConfirmationBanner("✅ Branch submitted successfully");
    closeAppendixModal();
    showBranchSummary({
      branch_name: "Mock Branch",
      branch_address: "123 Dev Lane",
      manager_name: "Jane Doe",
      manager_position: "Manager",
      device_model: "EFD-X100",
      device_serial: "SN123456"
});
}, 1000);
}

// ✅ Confirmation Banner
function showConfirmationBanner(text = "✅ Submitted!") {
  const banner = document.getElementById("confirmationBanner");
  if (!banner) return;
  banner.textContent = text;
  banner.classList.add("show");
  setTimeout(() => banner.classList.remove("show"), 3000);
}

// 🧾 Branch Summary
function showBranchSummary(data) {
  const box = document.getElementById("branchSummary");
  if (!box) return;
  box.innerHTML = `
    <div class="summary-box">
      <h5>Branch Summary</h5>
      <p><strong>Name:</strong> ${data.branch_name}</p>
      <p><strong>Address:</strong> ${data.branch_address}</p>
      <p><strong>Manager:</strong> ${data.manager_name} (${data.manager_position})</p>
      <p><strong>Device:</strong> ${data.device_model} – SN: ${data.device_serial}</p>
    </div>
  `;
  box.classList.add("visible");
  setTimeout(() => box.classList.remove("visible"), 6000);
}

