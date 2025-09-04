/***********************
 * Firebase-based site logic (Auth + Buttons + Flow)
 * Using firebase-compat SDK
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  // Show/hide "Other" goal field
const goalSelect = document.getElementById("signup-goal");
const goalOther = document.getElementById("signup-goal-other");

if (goalSelect && goalOther) {
  goalSelect.addEventListener("change", () => {
    if (goalSelect.value === "other") {
      goalOther.style.display = "block";   // Show field
      goalOther.required = true;
    } else {
      goalOther.style.display = "none";    // Hide field
      goalOther.required = false;
      goalOther.value = "";
    }
  });
}

  const auth = firebase.auth();
  const db   = firebase.firestore();
  
  


  /***********************
   * Header Auth Button + Dropdown
   ***********************/
  function updateAuthButton(user) {
    const authBtn   = document.getElementById("auth-btn");
    const dropdown  = document.getElementById("account-dropdown");
    const logoutBtn = document.getElementById("logout-btn");
    if (!authBtn) return;

    if (user) {
      authBtn.innerText = user.displayName || (user.email ? user.email.split("@")[0] : "My Account");
      authBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropdown) dropdown.classList.toggle("hidden");
      };

      if (logoutBtn) {
        logoutBtn.onclick = async (e) => {
          e.preventDefault();
          try {
            await auth.signOut();
            alert("👋 Logged out");
            window.location.href = "index.html";
          } catch (err) {
            alert("❌ " + err.message);
          }
        };
      }
    } else {
      authBtn.innerText = "Sign In";
      authBtn.onclick = (e) => {
        e.preventDefault();
        window.location.href = "signin.html";
      };
    }
  }

  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("account-dropdown");
    const authBtn  = document.getElementById("auth-btn");
    if (dropdown && !dropdown.contains(e.target) && (!authBtn || !authBtn.contains(e.target))) {
      dropdown.classList.add("hidden");
    }
  });

  /***********************
   * Firebase Auth State
   ***********************/
  auth.onAuthStateChanged((user) => {
    updateAuthButton(user);

    const getStartedBtn = document.getElementById("get-started-btn");
    if (getStartedBtn) {
      getStartedBtn.onclick = (e) => {
        e.preventDefault();
        if (user) window.location.href = "plans.html";
        else window.location.href = "signin.html";
      };
    }

    const offerBtn = document.getElementById("offer-btn");
    if (offerBtn) {
      offerBtn.onclick = (e) => {
        e.preventDefault();
        if (user) window.location.href = "plans.html";
        else window.location.href = "signin.html";
      };
    }
  });

  /***********************
   * Tabs (Sign In / Sign Up)
   ***********************/
  const signinForm = document.getElementById("signin-form");
  const signupForm = document.getElementById("signup-form");
  const tabSignin  = document.getElementById("tab-signin");
  const tabSignup  = document.getElementById("tab-signup");

  function showAuthForm(which) {
    if (!signinForm || !signupForm) return;
    const IN = which === "in";
    const UP = which === "up";
    signinForm.classList.toggle("visible", IN);
    signupForm.classList.toggle("visible", UP);
    if (tabSignin) tabSignin.classList.toggle("active", IN);
    if (tabSignup) tabSignup.classList.toggle("active", UP);

    const slider = document.querySelector(".tab-container .tab-slider");
    if (slider) {
      slider.style.transform = IN ? "translateX(0%)" : "translateX(100%)";
    }
  }

  if (tabSignin && tabSignup) {
    tabSignin.addEventListener("click", () => showAuthForm("in"));
    tabSignup.addEventListener("click", () => showAuthForm("up"));
    showAuthForm("in");
  }

  /***********************
   * Firebase Sign In
   ***********************/
  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signin-email").value.trim();
      const password = document.getElementById("signin-password").value.trim();

      try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("✅ Login successful!");
        window.location.href = "index.html";
      } catch (err) {
        alert("❌ " + err.message);
      }
    });
  }

  /***********************
   * Firebase Sign Up + Firestore + EmailJS
   ***********************/
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name      = document.getElementById("signup-name").value.trim();
      const age       = document.getElementById("signup-age").value.trim();
      const weight    = document.getElementById("signup-weight").value.trim();
      const height    = document.getElementById("signup-height").value.trim();
      const allergies = document.getElementById("signup-allergies").value.trim();
      let goal = document.getElementById("signup-goal").value.trim();
if (goal === "other") {
  goal = document.getElementById("signup-goal-other").value.trim();
}


      const diseases  = document.getElementById("signup-diseases").value.trim();
      const diet      = document.getElementById("signup-diet").value.trim();
      const phone     = document.getElementById("signup-phone").value.trim();
      const email     = document.getElementById("signup-email").value.trim();
      const password  = document.getElementById("signup-password").value.trim();
      const confirm   = document.getElementById("signup-confirm").value.trim();
      const createdAt = new Date().toLocaleString();

      if (!email || !password || !name) {
        return alert("⚠️ Please fill all required fields.");
      }
      if (password !== confirm) {
        return alert("❌ Passwords do not match.");
      }

      const submitBtn = signupForm.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.innerText = "Creating Account...";

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });

        await db.collection("users").doc(cred.user.uid).set({
          name, age, weight, height, allergies, goal, diseases, diet,
          phone, email, createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await emailjs.send("service_33dvh4i", "template_k50l1o6", {
          name, age, weight, height, allergies, goal, diseases, diet,
          phone, email, createdAt
        });

        alert("🎉 Account created successfully!");
        window.location.href = "index.html";

      } catch (err) {
        console.error(err);
        alert("❌ " + err.message);
        submitBtn.disabled = false;
        submitBtn.innerText = "Create Account";
      }
    });
  }

  /***********************
   * BUY NOW → Requirements → Payment
   ***********************/
  window.handleBuyNow = function() {
    const user = firebase.auth().currentUser;
    if (user) {
      window.location.href = "custom-plan.html";
    } else {
      window.location.href = "signin.html";
    }
  };
});
// Force correct visibility of the "Other goal" field on load
window.addEventListener("load", () => {
  const goalSelect = document.getElementById("signup-goal");
  const goalOther  = document.getElementById("signup-goal-other");

  if (goalSelect && goalOther) {
    // Always start hidden
    goalOther.style.setProperty("display", "none", "important");

    // Update visibility whenever dropdown changes
    goalSelect.addEventListener("change", () => {
      if (goalSelect.value === "other") {
        goalOther.style.setProperty("display", "block", "important");
        goalOther.required = true;
      } else {
        goalOther.style.setProperty("display", "none", "important");
        goalOther.required = false;
        goalOther.value = "";
      }
    });
  }
});
