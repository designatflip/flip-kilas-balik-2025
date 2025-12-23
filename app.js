// Global error handler for uncaught errors
window.addEventListener("error", function (event) {
  console.error("Global error caught:", event.error);
  // You can trigger error page here if needed
});

// Vanilla JavaScript - No React needed
document.addEventListener("DOMContentLoaded", async function () {
  // Reset scroll position to top on page load
  window.scrollTo(0, 0);

  // Create loading screen
  const loadingScreen = document.createElement("div");
  loadingScreen.className = "loading-screen";
  loadingScreen.innerHTML = `
    <img src="assets/loader-illustraions.png" alt="Loading" class="loading-illustration">
    <div class="loading-text">Lagi nulis suratnya...<br>Tunggu ya</div>
    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
    <div class="progress-percentage">0%</div>
  `;
  document.body.appendChild(loadingScreen);

  const progressBar = loadingScreen.querySelector(".progress-bar");
  const progressPercentage = loadingScreen.querySelector(
    ".progress-percentage"
  );

  // Get uid from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");

  // Fetch user data from Supabase
  let userName = "[username]"; // Default fallback
  let amountSaved = "[amount saved]"; // Default fallback
  let flipDealsPurchase = "[flip_deals_purchase_trx]"; // Default fallback
  let cashbackReceived = "[cashback_received_amount]"; // Default fallback
  let ewalletTopupCount = "[ewallet_topup_count]"; // Default fallback
  let qrisTransactionCount = "[qris_transaction_count]"; // Default fallback
  let unitOwned = "[unit_owned]"; // Default fallback
  let profitShareReceiver = ""; // Default fallback
  let uniqueCodeDonation = "[unique_code_donation_amount]"; // Default fallback
  let qrisTransactionCountRaw = 0;
  let ewalletTopupCountRaw = 0;
  let flipDealsPurchaseRaw = 0;
  let cashbackReceivedRaw = 0;
  let amountSavedRaw = 0;
  let goldTransactionCount = 0;
  let unitOwnedRaw = 0;
  let profitShareReceiverRaw = 0;
  let uniqueCodeDonationRaw = 0;
  let donationAmount = 0;

  // Variable to track if there was an error loading data
  let dataLoadError = false;

  // Analytics tracking object
  const analytics = {
    uid: uid,
    userName: "",
    scrollMilestone: 0,
    isClickShareBtn: false,
    isClickShareBtnPopUp: false,
    isClickingGalleryBtn: false,
    countWallpaperDownload: 0,
    isClickLastBanner: false,
    milestones: new Set(), // Track which milestones have been reached
  };

  // Helper function to detect platform
  const isIOS = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isAndroid = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android/.test(userAgent);
  };

  // Function to save analytics to database
  const saveAnalytics = async () => {
    if (!uid || !supabase || dataLoadError) return;

    try {
      const { error } = await supabase.from("user_record").upsert(
        {
          uid: analytics.uid,
          userName: analytics.userName,
          scrollMilestone: analytics.scrollMilestone,
          isClickShareBtn: analytics.isClickShareBtn,
          isClickShareBtnPopUp: analytics.isClickShareBtnPopUp,
          isClickingGalleryBtn: analytics.isClickingGalleryBtn,
          countWallpaperDownload: analytics.countWallpaperDownload,
          isClickLastBanner: analytics.isClickLastBanner,
        },
        { onConflict: "uid" }
      );

      if (error) {
        console.error("Error saving analytics:", error);
      }
    } catch (error) {
      console.error("Analytics save failed:", error);
    }
  };

  // Debounced save function to avoid too frequent database writes
  let saveTimeout = null;
  const debouncedSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveAnalytics, 1000); // Save after 1 second of inactivity
  };

  if (uid && supabase) {
    try {
      const { data, error } = await supabase
        .from("yir-flip-2025")
        .select(
          "user_name, amount_saved, flip_deals_purchase_trx, cashback_received_amount, ewallet_topup_count, qris_transaction_count, unit_owned, profit_share_receiver, unique_code_donation_amount, gold_transaction_count, donation_amount"
        )
        .eq("user_id", uid)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        // Any error (including UID not found) should show failed to load page
        dataLoadError = true;
      } else if (data) {
        if (data.user_name) {
          userName = data.user_name;
          analytics.userName = data.user_name;
        }

        // Fetch existing analytics if available
        const { data: existingAnalytics } = await supabase
          .from("user_record")
          .select("*")
          .eq("uid", uid)
          .single();

        if (existingAnalytics) {
          // Load existing values into analytics object
          analytics.scrollMilestone = existingAnalytics.scrollMilestone || 0;
          analytics.isClickShareBtn =
            existingAnalytics.isClickShareBtn || false;
          analytics.isClickShareBtnPopUp =
            existingAnalytics.isClickShareBtnPopUp || false;
          analytics.isClickingGalleryBtn =
            existingAnalytics.isClickingGalleryBtn || false;
          analytics.countWallpaperDownload =
            existingAnalytics.countWallpaperDownload || 0;
          analytics.isClickLastBanner =
            existingAnalytics.isClickLastBanner || false;
          // Reconstruct milestones set based on current scrollMilestone
          if (existingAnalytics.scrollMilestone >= 10)
            analytics.milestones.add(10);
          if (existingAnalytics.scrollMilestone >= 20)
            analytics.milestones.add(20);
          if (existingAnalytics.scrollMilestone >= 30)
            analytics.milestones.add(30);
          if (existingAnalytics.scrollMilestone >= 40)
            analytics.milestones.add(40);
          if (existingAnalytics.scrollMilestone >= 50)
            analytics.milestones.add(50);
          if (existingAnalytics.scrollMilestone >= 60)
            analytics.milestones.add(60);
          if (existingAnalytics.scrollMilestone >= 70)
            analytics.milestones.add(70);
          if (existingAnalytics.scrollMilestone >= 80)
            analytics.milestones.add(80);
          if (existingAnalytics.scrollMilestone >= 90)
            analytics.milestones.add(90);
          if (existingAnalytics.scrollMilestone >= 100)
            analytics.milestones.add(100);
        }

        // Save initial analytics only if this is a new visit (no existing analytics)
        if (!existingAnalytics) {
          await saveAnalytics();
        }
        if (data.amount_saved !== null && data.amount_saved !== undefined) {
          amountSavedRaw = data.amount_saved;
          amountSaved = `Rp${data.amount_saved.toLocaleString("id-ID", {
            maximumFractionDigits: 0,
          })}`;
        }
        if (
          data.flip_deals_purchase_trx !== null &&
          data.flip_deals_purchase_trx !== undefined
        ) {
          flipDealsPurchaseRaw = data.flip_deals_purchase_trx;
          flipDealsPurchase = data.flip_deals_purchase_trx;
        }
        if (
          data.cashback_received_amount !== null &&
          data.cashback_received_amount !== undefined
        ) {
          cashbackReceivedRaw = data.cashback_received_amount;
          cashbackReceived = `Rp${data.cashback_received_amount.toLocaleString(
            "id-ID",
            { maximumFractionDigits: 0 }
          )}`;
        }
        if (
          data.ewallet_topup_count !== null &&
          data.ewallet_topup_count !== undefined
        ) {
          ewalletTopupCountRaw = data.ewallet_topup_count;
          ewalletTopupCount = data.ewallet_topup_count;
        }
        if (
          data.qris_transaction_count !== null &&
          data.qris_transaction_count !== undefined
        ) {
          qrisTransactionCountRaw = data.qris_transaction_count;
          qrisTransactionCount = data.qris_transaction_count;
        }
        if (data.unit_owned !== null && data.unit_owned !== undefined) {
          unitOwnedRaw = data.unit_owned;
          unitOwned = data.unit_owned;
        }
        if (
          data.profit_share_receiver !== null &&
          data.profit_share_receiver !== undefined
        ) {
          profitShareReceiverRaw = data.profit_share_receiver;
          profitShareReceiver = `Rp${data.profit_share_receiver.toLocaleString(
            "id-ID",
            { maximumFractionDigits: 0 }
          )}`;
        }
        if (
          data.unique_code_donation_amount !== null &&
          data.unique_code_donation_amount !== undefined
        ) {
          uniqueCodeDonationRaw = data.unique_code_donation_amount;
          uniqueCodeDonation = `Rp${data.unique_code_donation_amount.toLocaleString(
            "id-ID"
          )}`;
        }
        if (
          data.gold_transaction_count !== null &&
          data.gold_transaction_count !== undefined
        ) {
          goldTransactionCount = data.gold_transaction_count;
        }
        if (
          data.donation_amount !== null &&
          data.donation_amount !== undefined
        ) {
          donationAmount = data.donation_amount;
        }
      }
    } catch (err) {
      console.error("Error:", err);
      dataLoadError = true;
    }
  } else if (!supabase) {
    // If Supabase client is not initialized, show error page
    console.error("Supabase client not initialized");
    dataLoadError = true;
  }

  const assets = [
    "assets/asset 01.png",
    "assets/asset 02.png",
    "assets/asset 03-A.png",
    "assets/asset 03-B.png",
    "assets/asset 04.png",
    "assets/asset 05.png",
    "assets/asset 06.png",
    "assets/asset 07.png",
    "assets/asset 08.png",
    "assets/asset 09.png",
    "assets/asset 10.png",
    "assets/asset 11.png",
    "assets/asset 12.png",
    "assets/asset 14.png",
    "assets/asset 15.png",
    "assets/asset 17.png",
    "assets/asset 18.png",
    "assets/asset 19.png",
    "assets/asset 20.png",
    "assets/asset 21.png",
    "assets/asset 22.png",
    "assets/asset 24.png", // Moved asset 24 before asset 23
    "assets/asset 23.png", // Moved asset 23 after asset 24
    "assets/asset 25.png",
    "assets/asset 26.png",
    "assets/asset 27.png",
    "assets/asset 28.png",
    "assets/asset 29.png",
    "assets/asset 30.png",
  ];

  // Additional assets to preload
  const additionalAssets = [
    "assets/bg-image.png",
    "assets/asset-divider.png",
    "assets/last-banner.png",
    "assets/navigation/back-envelope.png",
    "assets/navigation/front-envelope.png",
    "assets/navigation/close-button.png",
    "assets/navigation/Share_btn.png",
    "assets/navigation/Gallery_btn.png",
    "assets/failed-to-load.png",
    "assets/id-not-found.png",
    "assets/loader-illustraions.png",
    "assets/navigation/reload_btn.png",
    "assets/navigation/back-to-home_btn.png",
    "assets/navigation/Gallery_btn_home.png",
    "assets/navigation/Download_btn.png",
    "assets/navigation/share-content_btn.png",
    "assets/navigation/close-button.png",
    "assets/wallpaper/flip-kilas-balik-2025-01.png",
    "assets/wallpaper/flip-kilas-balik-2025-02.png",
    "assets/wallpaper/flip-kilas-balik-2025-03.png",
    "assets/wallpaper/flip-kilas-balik-2025-04.png",
    "assets/wallpaper/flip-kilas-balik-2025-05.png",
    "assets/wallpaper/flip-kilas-balik-2025-06.png",
  ];

  const allAssets = [...assets, ...additionalAssets];

  // Function to show error page
  const showErrorPage = () => {
    // Remove loading screen if it exists
    if (loadingScreen && loadingScreen.parentNode) {
      loadingScreen.remove();
    }

    // Create error page
    const errorPage = document.createElement("div");
    errorPage.className = "error-page";
    errorPage.innerHTML = `
      <img src="assets/failed-to-load.png" alt="Failed to Load" class="error-illustration">
      <div class="error-text">Hmm suratnya gagal dimuat. Coba lagi ya</div>
    `;
    document.body.appendChild(errorPage);

    // Create bottom navigation for error page
    const errorEnvelopeContainer = document.createElement("div");
    errorEnvelopeContainer.className = "sticky-envelope";

    const errorEnvelopeImg = document.createElement("img");
    errorEnvelopeImg.src = "assets/navigation/front-envelope.png";
    errorEnvelopeImg.alt = "Envelope";
    errorEnvelopeContainer.appendChild(errorEnvelopeImg);

    const errorNavButtons = document.createElement("div");
    errorNavButtons.className = "nav-buttons";

    const errorCloseBtn = document.createElement("img");
    errorCloseBtn.src = "assets/navigation/close-button.png";
    errorCloseBtn.alt = "Close";
    errorCloseBtn.className = "nav-btn close-btn";
    errorCloseBtn.addEventListener("click", () => {
      const win = window;
      if (win.ReactNativeWebView) {
        win.ReactNativeWebView.postMessage("exit-page");
      }
    });

    const reloadBtn = document.createElement("img");
    reloadBtn.src = "assets/navigation/reload_btn.png";
    reloadBtn.alt = "Reload";
    reloadBtn.className = "nav-btn reload-btn";
    reloadBtn.addEventListener("click", () => {
      // Preserve URL parameters when reloading
      window.location.reload();
    });

    const errorGalleryBtn = document.createElement("img");
    errorGalleryBtn.src = "assets/navigation/Gallery_btn.png";
    errorGalleryBtn.alt = "Gallery";
    errorGalleryBtn.className = "nav-btn gallery-btn";

    errorNavButtons.appendChild(errorCloseBtn);
    errorNavButtons.appendChild(reloadBtn);
    errorNavButtons.appendChild(errorGalleryBtn);

    errorEnvelopeContainer.appendChild(errorNavButtons);
    document.body.appendChild(errorEnvelopeContainer);

    // Create back envelope
    const errorBackEnvelope = document.createElement("div");
    errorBackEnvelope.className = "sticky-back-envelope";
    const errorBackEnvelopeImg = document.createElement("img");
    errorBackEnvelopeImg.src = "assets/navigation/back-envelope.png";
    errorBackEnvelopeImg.alt = "Back Envelope";
    errorBackEnvelope.appendChild(errorBackEnvelopeImg);
    document.body.appendChild(errorBackEnvelope);
  };

  // Function to show UID not found page
  const showUidNotFoundPage = () => {
    console.log("Showing UID not found page");

    // Remove loading screen if it exists
    if (loadingScreen && loadingScreen.parentNode) {
      loadingScreen.remove();
    }

    // Create UID not found page content
    const uidNotFoundPage = document.createElement("div");
    uidNotFoundPage.className = "uid-not-found-page";
    uidNotFoundPage.innerHTML = `
      <img src="assets/id-not-found.png" alt="ID Not Found" class="uid-not-found-illustration">
      <div class="uid-not-found-text">Waduh, suratnya gak bisa dimuat :(</div>
    `;
    document.body.appendChild(uidNotFoundPage);
    console.log("UID not found page created");

    // Create front envelope with buttons
    const uidNotFoundEnvelopeContainer = document.createElement("div");
    uidNotFoundEnvelopeContainer.className = "sticky-envelope";

    const uidNotFoundEnvelopeImg = document.createElement("img");
    uidNotFoundEnvelopeImg.src = "assets/navigation/front-envelope.png";
    uidNotFoundEnvelopeImg.alt = "Envelope";
    uidNotFoundEnvelopeContainer.appendChild(uidNotFoundEnvelopeImg);

    const uidNotFoundNavButtons = document.createElement("div");
    uidNotFoundNavButtons.className = "nav-buttons";

    const uidNotFoundCloseBtn = document.createElement("img");
    uidNotFoundCloseBtn.src = "assets/navigation/close-button.png";
    uidNotFoundCloseBtn.alt = "Close";
    uidNotFoundCloseBtn.className = "nav-btn close-btn";
    uidNotFoundCloseBtn.addEventListener("click", () => {
      const win = window;
      if (win.ReactNativeWebView) {
        win.ReactNativeWebView.postMessage("exit-page");
      }
    });

    const backToHomeBtn = document.createElement("img");
    backToHomeBtn.src = "assets/navigation/back-to-home_btn.png";
    backToHomeBtn.alt = "Back to Home";
    backToHomeBtn.className = "nav-btn back-to-home-btn";
    backToHomeBtn.addEventListener("click", () => {
      const win = window;
      if (win.ReactNativeWebView) {
        win.ReactNativeWebView.postMessage("exit-page");
      }
    });

    const uidNotFoundGalleryBtn = document.createElement("img");
    uidNotFoundGalleryBtn.src = "assets/navigation/Gallery_btn.png";
    uidNotFoundGalleryBtn.alt = "Gallery";
    uidNotFoundGalleryBtn.className = "nav-btn gallery-btn";

    uidNotFoundNavButtons.appendChild(uidNotFoundCloseBtn);
    uidNotFoundNavButtons.appendChild(backToHomeBtn);
    uidNotFoundNavButtons.appendChild(uidNotFoundGalleryBtn);

    uidNotFoundEnvelopeContainer.appendChild(uidNotFoundNavButtons);
    document.body.appendChild(uidNotFoundEnvelopeContainer);
    console.log("Front envelope with buttons created");

    // Store reference for later use
    window.uidNotFoundGalleryBtn = uidNotFoundGalleryBtn;

    console.log("All UID not found elements appended to body");
  };

  // Preload all assets
  let loadedCount = 0;
  let failedCount = 0;
  const totalAssets = allAssets.length;

  const updateProgress = () => {
    const percentage = Math.round((loadedCount / totalAssets) * 100);
    progressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;
  };

  const preloadPromises = allAssets.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        updateProgress();
        resolve();
      };
      img.onerror = () => {
        loadedCount++;
        failedCount++;
        updateProgress();
        reject(new Error(`Failed to load: ${src}`));
      };
      img.src = src;
    });
  });

  // Wait for all assets to load
  try {
    await Promise.all(preloadPromises);
  } catch (error) {
    console.error("Error loading assets:", error);
    // If too many assets failed (more than 20%), show error page
    if (failedCount > totalAssets * 0.2) {
      showErrorPage();
      return; // Stop execution
    }
  }

  // Add a small delay to show 100% before fading out
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Fade out loading screen
  loadingScreen.classList.add("fade-out");

  // Wait for fade-out animation to complete
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Remove loading screen from DOM after fade completes
  loadingScreen.remove();

  const root = document.getElementById("root");

  // Create gallery page BEFORE checking for errors so it's always available
  const createGalleryPage = () => {
    const galleryPage = document.createElement("div");
    galleryPage.className = "gallery-page";
    galleryPage.id = "galleryPage";

    const galleryContainer = document.createElement("div");
    galleryContainer.className = "gallery-container";

    const galleryTitle = document.createElement("div");
    galleryTitle.className = "gallery-title";
    galleryTitle.innerHTML = `
      Pesan-pesan buat kamu 🫶🏻<br>
      <span class="gallery-subtitle">Kamu bisa download gambarnya kalo relate sama kamu</span>
    `;

    const wallpaperGrid = document.createElement("div");
    wallpaperGrid.className = "wallpaper-grid";

    // Wallpaper assets
    const wallpapers = [
      "assets/wallpaper/flip-kilas-balik-2025-01.png",
      "assets/wallpaper/flip-kilas-balik-2025-02.png",
      "assets/wallpaper/flip-kilas-balik-2025-03.png",
      "assets/wallpaper/flip-kilas-balik-2025-04.png",
      "assets/wallpaper/flip-kilas-balik-2025-05.png",
      "assets/wallpaper/flip-kilas-balik-2025-06.png",
    ];

    // Create wallpaper items
    wallpapers.forEach((wallpaperSrc, index) => {
      const wallpaperItem = document.createElement("div");
      wallpaperItem.className = "wallpaper-item";

      const wallpaperImg = document.createElement("img");
      wallpaperImg.src = wallpaperSrc;
      wallpaperImg.alt = `Wallpaper ${index + 1}`;
      wallpaperItem.appendChild(wallpaperImg);

      const downloadBtnContainer = document.createElement("div");
      downloadBtnContainer.className = "download-btn-container";

      const downloadBtn = document.createElement("img");
      downloadBtn.src = "assets/navigation/Download_btn.png";
      downloadBtn.alt = "Download";
      downloadBtn.className = "wallpaper-download-btn";

      // Pre-fetch wallpaper blob for instant sharing (Android compatibility)
      let cachedBlob = null;
      fetch(wallpaperSrc)
        .then((response) => response.blob())
        .then((blob) => {
          cachedBlob = blob;
        })
        .catch((error) => {
          console.error("Failed to cache wallpaper:", error);
        });

      // Share functionality (triggered by clicking the image or download button)
      const handleShare = () => {
        // Use cached blob if available (instant share for Android)
        if (cachedBlob) {
          // Android: Direct download, iOS: Share dialog
          if (isAndroid()) {
            // Direct download for Android
            const url = window.URL.createObjectURL(cachedBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `wallpaper-${index + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else if (isIOS() && navigator.share) {
            // Share dialog for iOS
            const file = new File([cachedBlob], `wallpaper-${index + 1}.png`, {
              type: "image/png",
            });

            navigator
              .share({
                files: [file],
                title: "Flip Wallpaper",
              })
              .catch((error) => {
                console.error("Share failed:", error);
              });
          } else {
            // Fallback for other platforms
            const url = window.URL.createObjectURL(cachedBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `wallpaper-${index + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }
        } else {
          // Fallback to async fetch if blob not cached yet
          fetch(wallpaperSrc)
            .then((response) => response.blob())
            .then((blob) => {
              if (isAndroid()) {
                // Direct download for Android
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `wallpaper-${index + 1}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              } else if (isIOS() && navigator.share) {
                // Share dialog for iOS
                const file = new File([blob], `wallpaper-${index + 1}.png`, {
                  type: "image/png",
                });

                return navigator.share({
                  files: [file],
                  title: "Flip Wallpaper",
                });
              } else {
                // Fallback for other platforms
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `wallpaper-${index + 1}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }
            })
            .catch((error) => {
              console.error("Share failed:", error);
            });
        }
      };

      // Add click event to the wallpaper image to trigger share
      wallpaperImg.addEventListener("click", () => {
        // Track wallpaper click (image)
        if (!dataLoadError) {
          analytics.countWallpaperDownload++;
          debouncedSave();
        }
        handleShare();
      });

      // Download button click handler (same as clicking wallpaper image)
      downloadBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering wallpaper image click

        // Track wallpaper click (download button)
        if (!dataLoadError) {
          analytics.countWallpaperDownload++;
          debouncedSave();
        }

        // Trigger share (same as clicking the image)
        handleShare();
      });

      downloadBtnContainer.appendChild(downloadBtn);
      wallpaperItem.appendChild(downloadBtnContainer);
      wallpaperGrid.appendChild(wallpaperItem);
    });

    galleryContainer.appendChild(galleryTitle);
    galleryContainer.appendChild(wallpaperGrid);
    galleryPage.appendChild(galleryContainer);

    // Add gallery navigation envelope
    const galleryEnvelopeContainer = document.createElement("div");
    galleryEnvelopeContainer.className = "sticky-envelope";

    const galleryEnvelopeImg = document.createElement("img");
    galleryEnvelopeImg.src = "assets/navigation/front-envelope.png";
    galleryEnvelopeImg.alt = "Envelope";
    galleryEnvelopeContainer.appendChild(galleryEnvelopeImg);

    const galleryNavButtons = document.createElement("div");
    galleryNavButtons.className = "nav-buttons";

    const galleryCloseBtn = document.createElement("img");
    galleryCloseBtn.src = "assets/navigation/close-button.png";
    galleryCloseBtn.alt = "Close";
    galleryCloseBtn.className = "nav-btn close-btn";
    galleryCloseBtn.addEventListener("click", () => {
      const win = window;
      if (win.ReactNativeWebView) {
        win.ReactNativeWebView.postMessage("exit-page");
      }
    });

    const galleryShareBtn = document.createElement("img");
    galleryShareBtn.src = "assets/navigation/Share_btn.png";
    galleryShareBtn.alt = "Share";
    galleryShareBtn.className = "nav-btn share-btn";
    galleryShareBtn.addEventListener("click", () => {
      if (window.sharePopup) {
        window.sharePopup.classList.add("active");
      }
    });

    const galleryHomeBtn = document.createElement("img");
    galleryHomeBtn.src = "assets/navigation/Gallery_btn_home.png";
    galleryHomeBtn.alt = "Home";
    galleryHomeBtn.className = "nav-btn gallery-home-btn";
    galleryHomeBtn.addEventListener("click", () => {
      galleryPage.classList.remove("active");
      if (window.galleryBtn) {
        window.galleryBtn.src = "assets/navigation/Gallery_btn.png";
      }
    });

    galleryNavButtons.appendChild(galleryCloseBtn);
    galleryNavButtons.appendChild(galleryShareBtn);
    galleryNavButtons.appendChild(galleryHomeBtn);

    galleryEnvelopeContainer.appendChild(galleryNavButtons);
    galleryPage.appendChild(galleryEnvelopeContainer);

    document.body.appendChild(galleryPage);
    return galleryPage;
  };

  const galleryPage = createGalleryPage();

  // UID not found gallery button click handler (if it exists)
  if (window.uidNotFoundGalleryBtn) {
    window.uidNotFoundGalleryBtn.addEventListener("click", () => {
      galleryPage.classList.add("active");
      window.uidNotFoundGalleryBtn.src =
        "assets/navigation/Gallery_btn_home.png";
    });
  }

  // Check if there was an error loading data and show error page
  if (dataLoadError) {
    showErrorPage();
    return; // Stop execution, don't render main content
  }

  // Create app container
  const appContainer = document.createElement("div");
  appContainer.className = "app-container";

  // Create background image
  const backgroundImageContainer = document.createElement("div");
  backgroundImageContainer.className = "background-image";
  const backgroundImg = document.createElement("img");
  backgroundImg.src = "assets/bg-image.png";
  backgroundImg.alt = "Background";
  backgroundImageContainer.appendChild(backgroundImg);
  appContainer.appendChild(backgroundImageContainer);

  // Create scroll indicator
  const scrollIndicator = document.createElement("div");
  scrollIndicator.className = "scroll-indicator";
  scrollIndicator.innerHTML = `
    <div class="arrow">↑</div>
    <div class="text">Scroll up buat baca surat kamu</div>
  `;
  appContainer.appendChild(scrollIndicator);

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content-wrapper";

  // Check if we should show Flip Deals content
  const hasFlipDealsData = cashbackReceivedRaw > 0 || flipDealsPurchaseRaw > 0;

  // Create image elements
  assets.forEach((src, index) => {
    // Skip asset 15 and 17 if no Flip Deals data
    if (!hasFlipDealsData && (index === 14 || index === 15)) {
      return; // Skip rendering these assets
    }

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Asset ${index + 1}`;
    img.loading = "lazy";

    imageContainer.appendChild(img);

    // Add amount saved overlay on asset 14 (index 12)
    if (index === 12) {
      const amountOverlay = document.createElement("div");
      amountOverlay.className = "amount-overlay";
      amountOverlay.innerHTML = `<strong style="margin-bottom: -24px; display: block; font-family: 'Sometype Mono', monospace;">${amountSaved}</strong>`;
      imageContainer.appendChild(amountOverlay);
    }

    // Add flip deals and cashback data overlay on asset 17 (index 15)
    if (index === 15) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `
        <strong style="margin-bottom: 20px; display: block; font-family: 'Sometype Mono', monospace;">${flipDealsPurchase}</strong>
        <strong style="margin-bottom: 50px; display: block; font-family: 'Sometype Mono', monospace;">${cashbackReceived}</strong>
      `;
      imageContainer.appendChild(dataOverlay);
    }

    // Add ewallet topup count overlay on asset 19 (index 17)
    if (index === 17) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `<strong style="margin-bottom: 82px; display: block; font-family: 'Sometype Mono', monospace;">${ewalletTopupCount}x </strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add qris transaction count overlay on asset 20 (index 18)
    if (index === 18) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `<strong style="margin-bottom: 82px; display: block; font-family: 'Sometype Mono', monospace;">${qrisTransactionCount}x</strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add unit owned overlay on asset 21 (index 19)
    if (index === 19) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `<strong style="margin-bottom: 82px; display: block; font-family: 'Sometype Mono', monospace;">${unitOwned}</strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add profit share receiver overlay on asset 22 (index 20)
    if (index === 20) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `<strong style="margin-bottom: 82px; display: block; font-family: 'Sometype Mono', monospace;">${profitShareReceiver}</strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add unique code donation overlay on asset 24 (now at index 21)
    if (index === 21) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      const totalDonation = uniqueCodeDonationRaw + donationAmount;
      const totalDonationFormatted = `Rp${totalDonation.toLocaleString(
        "id-ID",
        { maximumFractionDigits: 0 }
      )}`;
      dataOverlay.innerHTML = `<strong style="margin-bottom: 82px; display: block; font-family: 'Sometype Mono', monospace;">${totalDonationFormatted}</strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add data stamp overlays on asset 26 (index 24)
    if (index === 24) {
      const stampOverlay = document.createElement("div");
      stampOverlay.className = "stamp-overlay";
      stampOverlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-family: 'Sometype Mono', monospace;
          color: #1B3238;
        `;

      // Helper function to create stamp data with absolute positioning
      // Positions are in percentages (left, bottom from container)
      const createStamp = (value, label, left, bottom) => {
        return `
            <div style="position: absolute; left: ${left}%; bottom: ${bottom}%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; text-align: center;">
              <div style="font-size: clamp(16px, 4vw, 24px); font-weight: bold; margin-bottom: 2px;">${value}</div>
              <div style="font-size: clamp(8px, 2vw, 11px); line-height: 1.2; white-space: nowrap;">${label}</div>
            </div>
          `;
      };

      // Format currency values with Rp and thousand separators
      const formatCurrency = (value) => {
        return `Rp${Math.floor(value).toLocaleString("id-ID")}`;
      };

      // Position each stamp at bottom center of its stamp box
      // Format: createStamp(value, label, left%, bottom%)
      stampOverlay.innerHTML = `
          ${createStamp(
            formatCurrency(amountSavedRaw),
            "Hemat pakai Flip",
            33,
            73
          )}
          ${createStamp(ewalletTopupCountRaw + "x", "Top up E-Wallet", 77, 73)}
          ${createStamp(flipDealsPurchaseRaw + "x", "Flip Deals", 23, 52)}
          ${createStamp(
            formatCurrency(cashbackReceivedRaw),
            "Cashback Flip Deals",
            68,
            52
          )}
          ${createStamp(qrisTransactionCountRaw + "x", "QRIS", 19, 32)}
          ${createStamp(unitOwnedRaw, "gr emas", 46, 32)}
          ${createStamp(
            formatCurrency(uniqueCodeDonationRaw),
            "Donasi Kode Unik",
            77,
            32
          )}
          ${createStamp(
            formatCurrency(profitShareReceiverRaw),
            "Bagi Hasil SuperFlip",
            28,
            11
          )}
          ${createStamp(formatCurrency(donationAmount), "Total Donasi", 72, 11)}
        `;

      imageContainer.appendChild(stampOverlay);
    }

    contentWrapper.appendChild(imageContainer);

    // Add text after asset 01 (index 0)
    if (index === 0) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1A2022";
      textContainer.textContent = `1 Januari — 1 Desember 2025 \n Buat ${userName}`;
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 02 (index 1)
    if (index === 1) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1A2022";

      textContainer.textContent =
        "Akhirnya kita sampai juga di penghujung tahun 2025. ";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 03-A (index 2)
    if (index === 2) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";

      textContainer.textContent = "Banyak hal yang udah dilewati tahun ini";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 03-B (index 3)
    if (index === 3) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";
      textContainer.textContent =
        "Meski terasa berat, kamu berhasil melewatinya juga. ";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 04 (index 4)
    if (index === 4) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";
      textContainer.textContent = "Makasih ya, udah bertahan sejauh ini.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 05 (index 5)
    if (index === 5) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";
      textContainer.textContent =
        "Mungkin kamu merasa gak banyak pencapaian yang berarti tahun ini";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 06 (index 6)
    if (index === 6) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";
      textContainer.textContent = "rasanya kayak jalan di tempat aja ";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 07 (index 7)
    if (index === 7) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";
      textContainer.textContent = "tapi kita coba lihat lagi yuk.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 08 (index 8)
    if (index === 8) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Kadang progres itu gak selalu kelihatan dan itu gapapa. ";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 09 (index 9)
    if (index === 9) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Dan ternyata, kamu punya banyak cara buat terus bertahan.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 10 (index 10)
    if (index === 10) {
      const textContainer = document.createElement("div");
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.className = "text-container";
      textContainer.textContent = "Tahun ini kamu berusaha terus hemat. ";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 11 (index 11)
    if (index === 11) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Hitung-hitung setiap pengeluaran, cari mana yang bisa dipangkas, mana yang bisa dialihkan.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 12 (index 12)
    if (index === 12) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";
      textContainer.textContent =
        "Supaya uangnya bisa ditabung, atau dialihkan ke yang lebih penting";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 14 (index 13)
    if (index === 13) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";
      textContainer.textContent = "...kayak beli cimol bojot hehe";
      contentWrapper.appendChild(textContainer);

      // Add divider and Flip Deals content only if there's data
      if (hasFlipDealsData) {
        // Add divider image
        const dividerContainer = document.createElement("div");
        dividerContainer.className = "image-container";
        const dividerImg = document.createElement("img");
        dividerImg.src = "assets/asset-divider.png";
        dividerImg.alt = "Divider";
        dividerImg.loading = "lazy";
        dividerContainer.appendChild(dividerImg);
        contentWrapper.appendChild(dividerContainer);

        // Add text after divider
        const dividerTextContainer = document.createElement("div");
        dividerTextContainer.className = "text-container";
        dividerTextContainer.style.backgroundColor = "#3A5988";
        dividerTextContainer.textContent =
          "Kamu juga jago banget nemuin cara kreatif buat dapetin uang tambahan. ";
        contentWrapper.appendChild(dividerTextContainer);
      }
    }

    // Add text after asset 15 (index 14) - only if has data
    if (index === 14 && hasFlipDealsData) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent = "Kamu bisa bikin belanjaan jadi cuan";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 17 (index 15) - only if has data
    if (index === 15 && hasFlipDealsData) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent = "Setiap rupiah berarti, dan kamu tau itu.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 18 (index 16)
    if (index === 16) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Skill yang kamu kuasai tahun ini adalah bertahan tapi tetep sayang diri sendiri.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 19 (index 17)
    if (index === 17) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Jajan es krim pas lagi bad day, jalan cari angin segar, atau beli barang lucu yang bikin mood naik.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 20 (index 18)
    if (index === 18) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent = "Small joys yang bikin tetap waras.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 21 (index 19) - conditional based on unitOwnedRaw
    if (index === 19) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        unitOwnedRaw > 0
          ? "Kamu juga gak lupa buat nabung & investasi buat masa depan "
          : "Meski tahun ini belum beli emas di Flip, terima kasih kamu emas-ih bertahan sampai saat ini.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 22 (index 20) - conditional based on profitShareReceiverRaw
    if (index === 20) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        profitShareReceiverRaw > 0
          ? "Mungkin jumlahnya belum besar, tapi yang penting udah mulai."
          : "Bagi hasil belum ada, yang penting udah bisa bagi-bagi rezeki";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 24 (now at index 21)
    if (index === 21) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Selain itu, kamu juga masih sempat berbagi buat orang lain";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 23 (now at index 22) - conditional based on donationAmount
    if (index === 22) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        donationAmount > 0
          ? "Peduli itu bukan soal seberapa besar yang kamu kasih, tapi soal kamu masih ingat ada orang lain, meski kamu masih berjuang juga."
          : "Meski belum donasi di Flip, yang penting udah sering berbagi hehe";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 25 (index 23)
    if (index === 23) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";
      textContainer.style.color = "#fff";
      textContainer.textContent = "Mungkin gak kerasa, tapi liat deh...";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 26 (index 24)
    if (index === 25) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#C7D7EE";
      textContainer.style.color = "#222222";

      textContainer.textContent =
        "Setelah diinget lagi, ternyata banyak banget kan yang udah kita lewatin?";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 27 (index 25)
    // if (index === 25) {
    //   const textContainer = document.createElement("div");
    //   textContainer.className = "text-container";
    //   textContainer.style.backgroundColor = "#C7D7EE";
    //   textContainer.style.color = "#222222";
    //   textContainer.textContent =
    //     "Makasih ya udah gak menyerah, meski ada masanya pengen banget. ";
    //   contentWrapper.appendChild(textContainer);
    // }

    // Add text after asset 28 (index 26)
    if (index === 26) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#C7D7EE";
      textContainer.style.color = "#222222";
      textContainer.textContent =
        "Kalau ada yang belum tercapai, kita coba lagi tahun depan.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 29 (index 27)
    if (index === 27) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#C7D7EE";
      textContainer.style.color = "#222222";
      textContainer.textContent = "Salam cinta,  Flip 🫰🏻";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 30 (index 28)
    if (index === 28) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#1D2D44";
      textContainer.style.color = "#fff";
      textContainer.textContent =
        "Oh ya, jangan lupa doain dan donasi untuk saudara-saudara kita yang terdampak musibah di Sumatra ya. Semoga mereka diberi kekuatan buat melewati masa sulit ini.";
      contentWrapper.appendChild(textContainer);

      // Add last banner image after the text
      const bannerContainer = document.createElement("div");
      bannerContainer.className = "image-container";

      const bannerLink = document.createElement("a");
      bannerLink.href =
        "https://beramal.flip.id/sedekah/rumah-zakat/bantuan-banjir-sumatera";
      bannerLink.target = "_blank";
      bannerLink.rel = "noopener noreferrer";
      bannerLink.style.cssText = "display: block; cursor: pointer;";

      // Track last banner click
      bannerLink.addEventListener("click", () => {
        if (!dataLoadError) {
          analytics.isClickLastBanner = true;
          debouncedSave();
        }
      });

      const bannerImg = document.createElement("img");
      bannerImg.src = "assets/last-banner.png";
      bannerImg.alt = "Donasi Kemanusiaan";
      bannerImg.loading = "lazy";

      bannerLink.appendChild(bannerImg);
      bannerContainer.appendChild(bannerLink);
      contentWrapper.appendChild(bannerContainer);
    }
  });

  appContainer.appendChild(contentWrapper);

  // Ensure class is removed first, then trigger slide-up animation
  contentWrapper.classList.remove("loaded");
  setTimeout(() => {
    contentWrapper.classList.add("loaded");
  }, 100);

  // Create sticky back envelope at the bottom
  const backEnvelopeContainer = document.createElement("div");
  backEnvelopeContainer.className = "sticky-back-envelope";

  const backEnvelopeImg = document.createElement("img");
  backEnvelopeImg.src = "assets/navigation/back-envelope.png";
  backEnvelopeImg.alt = "Back Envelope";

  backEnvelopeContainer.appendChild(backEnvelopeImg);
  appContainer.appendChild(backEnvelopeContainer);

  // Create sticky front envelope at the bottom
  const envelopeContainer = document.createElement("div");
  envelopeContainer.className = "sticky-envelope";

  const envelopeImg = document.createElement("img");
  envelopeImg.src = "assets/navigation/front-envelope.png";
  envelopeImg.alt = "Envelope";

  envelopeContainer.appendChild(envelopeImg);

  // Create navigation buttons
  const navButtons = document.createElement("div");
  navButtons.className = "nav-buttons";

  const closeBtn = document.createElement("img");
  closeBtn.src = "assets/navigation/close-button.png";
  closeBtn.alt = "Close";
  closeBtn.className = "nav-btn close-btn";
  closeBtn.addEventListener("click", () => {
    // Save analytics before closing
    if (!dataLoadError) {
      saveAnalytics();
    }

    const win = window;
    if (win.ReactNativeWebView) {
      win.ReactNativeWebView.postMessage("exit-page");
    }
  });

  const shareBtn = document.createElement("img");
  shareBtn.src = "assets/navigation/Share_btn.png";
  shareBtn.alt = "Share";
  shareBtn.className = "nav-btn share-btn";

  const galleryBtn = document.createElement("img");
  galleryBtn.src = "assets/navigation/Gallery_btn.png";
  galleryBtn.alt = "Gallery";
  galleryBtn.className = "nav-btn gallery-btn";

  navButtons.appendChild(closeBtn);
  navButtons.appendChild(shareBtn);
  navButtons.appendChild(galleryBtn);

  envelopeContainer.appendChild(navButtons);
  appContainer.appendChild(envelopeContainer);

  root.appendChild(appContainer);

  // Gallery button click handler (gallery page was already created earlier)
  galleryBtn.addEventListener("click", () => {
    galleryPage.classList.add("active");
    galleryBtn.src = "assets/navigation/Gallery_btn_home.png";

    // Track gallery button click
    if (!dataLoadError) {
      analytics.isClickingGalleryBtn = true;
      debouncedSave();
    }
  });

  // Store galleryBtn reference for later use
  window.galleryBtn = galleryBtn;

  // Create share popup
  const createSharePopup = () => {
    const sharePopup = document.createElement("div");
    sharePopup.className = "share-popup";
    sharePopup.id = "sharePopup";

    const sharePopupContent = document.createElement("div");
    sharePopupContent.className = "share-popup-content";

    const shareTitle = document.createElement("div");
    shareTitle.className = "share-popup-title";
    shareTitle.textContent = "Bagikan ke teman-temanmu?";

    const sharePreviewContainer = document.createElement("div");
    sharePreviewContainer.className = "share-preview-container";

    // Create canvas to capture asset 26 with overlay
    const canvas = document.createElement("canvas");
    sharePreviewContainer.appendChild(canvas);

    // Function to generate share image
    const generateShareImage = async () => {
      // Find the image container for asset 26 by looking for the stamp overlay
      const allContainers = document.querySelectorAll(".image-container");
      let asset26Container = null;

      // Find container with stamp-overlay class
      for (let container of allContainers) {
        if (container.querySelector(".stamp-overlay")) {
          asset26Container = container;
          break;
        }
      }

      if (!asset26Container) {
        console.error("Asset 26 container not found");
        return;
      }

      const img = asset26Container.querySelector("img");
      if (!img) {
        console.error("Image not found in asset 26 container");
        return;
      }

      // Wait for image to load
      await new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
        }
      });

      // Set canvas dimensions to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Draw the stamp overlay data
      const stampOverlay = asset26Container.querySelector(".stamp-overlay");
      if (stampOverlay) {
        // Helper function to draw stamp data at absolute positions
        // leftPercent and bottomPercent are percentages of canvas dimensions
        const drawStamp = (value, label, leftPercent, bottomPercent) => {
          const x = (canvas.width * leftPercent) / 100;
          const y = canvas.height - (canvas.height * bottomPercent) / 100;

          // Set text properties
          ctx.fillStyle = "#1B3238";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          // Draw label first (at the bottom)
          const labelFontSize = Math.max(11, canvas.width * 0.022);
          ctx.font = `${labelFontSize}px 'Sometype Mono', monospace`;
          ctx.fillText(label, x, y);

          // Draw value above label (bold, larger)
          const valueFontSize = Math.max(24, canvas.width * 0.048);
          ctx.font = `bold ${valueFontSize}px 'Sometype Mono', monospace`;
          ctx.fillText(value, x, y - labelFontSize - 4);
        };

        // Format currency values with Rp and thousand separators
        const formatCurrency = (value) => {
          return `Rp${Math.floor(value).toLocaleString("id-ID")}`;
        };

        // Draw all stamps at their absolute positions (matching DOM overlay)
        // Format: drawStamp(value, label, left%, bottom%)
        drawStamp(formatCurrency(amountSavedRaw), "Hemat pakai Flip", 33, 73);
        drawStamp(ewalletTopupCountRaw + "x", "Top up E-Wallet", 77, 73);
        drawStamp(flipDealsPurchaseRaw + "x", "Flip Deals", 23, 52);
        drawStamp(
          formatCurrency(cashbackReceivedRaw),
          "Cashback Flip Deals",
          68,
          52
        );
        drawStamp(qrisTransactionCountRaw + "x", "QRIS", 19, 32);
        drawStamp(unitOwnedRaw, "gr emas", 46, 32);
        drawStamp(
          formatCurrency(uniqueCodeDonationRaw),
          "Donasi Kode Unik",
          77,
          32
        );
        drawStamp(
          formatCurrency(profitShareReceiverRaw),
          "Bagi Hasil SuperFlip",
          28,
          11
        );
        drawStamp(formatCurrency(donationAmount), "Total Donasi", 72, 11);
      }
    };

    // Generate image immediately when popup opens
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          if (sharePopup.classList.contains("active")) {
            // Small delay to ensure popup is rendered
            setTimeout(() => {
              generateShareImage();
            }, 100);
          }
        }
      });
    });

    observer.observe(sharePopup, { attributes: true });

    // Single share button using image
    const shareButton = document.createElement("img");
    shareButton.src = "assets/navigation/share-content_btn.png";
    shareButton.alt = "Bagikan";
    shareButton.className = "share-main-btn";
    shareButton.addEventListener("click", () => {
      // Track Bagikan button click in popup
      if (!dataLoadError) {
        analytics.isClickShareBtnPopUp = true;
        debouncedSave();
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Failed to create blob");
          return;
        }

        // Android: Direct download, iOS: Share dialog
        if (isAndroid()) {
          // Direct download for Android
          const dataUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "flip-kilas-balik-2025.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (isIOS() && navigator.share) {
          // Share dialog for iOS
          const file = new File([blob], "flip-kilas-balik-2025.png", {
            type: "image/png",
          });

          navigator
            .share({
              files: [file],
              title: "Flip Kilas Balik 2025",
              text: "Hey, tau gak? Banyak cerita yang terjadi di 2025 ini. Flip kirim surat tentang perjalananmu tahun ini. Cek detailnya di sini ya https://homepage1.onelink.me/eopM/9ua400dc",
            })
            .catch((err) => {
              console.error("Error sharing:", err);
            });
        } else {
          // Fallback: download the image if Web Share API is not supported
          const dataUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "flip-kilas-balik-2025.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, "image/png");
    });

    // Close button using image
    const closeBtn = document.createElement("img");
    closeBtn.src = "assets/navigation/close-button.png";
    closeBtn.alt = "Close";
    closeBtn.className = "share-close-btn";
    closeBtn.addEventListener("click", () => {
      sharePopup.classList.remove("active");
    });

    sharePopupContent.appendChild(closeBtn);
    sharePopupContent.appendChild(shareTitle);
    sharePopupContent.appendChild(sharePreviewContainer);
    sharePopupContent.appendChild(shareButton);

    sharePopup.appendChild(sharePopupContent);

    // Close popup when clicking outside
    sharePopup.addEventListener("click", (e) => {
      if (e.target === sharePopup) {
        sharePopup.classList.remove("active");
      }
    });

    document.body.appendChild(sharePopup);
    return sharePopup;
  };

  const sharePopup = createSharePopup();

  // Share button click handler
  shareBtn.addEventListener("click", () => {
    sharePopup.classList.add("active");

    // Track share button click
    if (!dataLoadError) {
      analytics.isClickShareBtn = true;
      debouncedSave();
    }
  });

  // Handle scroll effects for background fade and scroll indicator
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const maxScroll = 600; // Fade out completely by 600px scroll

    // Fade out background image as user scrolls
    const bgOpacity = Math.max(0, 1 - scrollY / maxScroll);
    backgroundImageContainer.style.opacity = bgOpacity;

    // Fade out scroll indicator as user scrolls
    const indicatorOpacity = Math.max(0, 1 - scrollY / 300); // Fades faster
    scrollIndicator.style.opacity = indicatorOpacity;

    // Hide scroll indicator completely after scrolling
    if (scrollY > 300) {
      scrollIndicator.style.display = "none";
    } else {
      scrollIndicator.style.display = "block";
    }

    // Track scroll milestones for analytics
    if (!dataLoadError) {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollY / scrollHeight) * 100);

      // Update milestone based on scroll percentage (10% increments)
      if (scrollPercentage >= 100 && !analytics.milestones.has(100)) {
        analytics.scrollMilestone = 100;
        analytics.milestones.add(100);
        debouncedSave();
      } else if (scrollPercentage >= 90 && !analytics.milestones.has(90)) {
        analytics.scrollMilestone = 90;
        analytics.milestones.add(90);
        debouncedSave();
      } else if (scrollPercentage >= 80 && !analytics.milestones.has(80)) {
        analytics.scrollMilestone = 80;
        analytics.milestones.add(80);
        debouncedSave();
      } else if (scrollPercentage >= 70 && !analytics.milestones.has(70)) {
        analytics.scrollMilestone = 70;
        analytics.milestones.add(70);
        debouncedSave();
      } else if (scrollPercentage >= 60 && !analytics.milestones.has(60)) {
        analytics.scrollMilestone = 60;
        analytics.milestones.add(60);
        debouncedSave();
      } else if (scrollPercentage >= 50 && !analytics.milestones.has(50)) {
        analytics.scrollMilestone = 50;
        analytics.milestones.add(50);
        debouncedSave();
      } else if (scrollPercentage >= 40 && !analytics.milestones.has(40)) {
        analytics.scrollMilestone = 40;
        analytics.milestones.add(40);
        debouncedSave();
      } else if (scrollPercentage >= 30 && !analytics.milestones.has(30)) {
        analytics.scrollMilestone = 30;
        analytics.milestones.add(30);
        debouncedSave();
      } else if (scrollPercentage >= 20 && !analytics.milestones.has(20)) {
        analytics.scrollMilestone = 20;
        analytics.milestones.add(20);
        debouncedSave();
      } else if (scrollPercentage >= 10 && !analytics.milestones.has(10)) {
        analytics.scrollMilestone = 10;
        analytics.milestones.add(10);
        debouncedSave();
      }
    }
  });

  // Save analytics when user leaves the page
  window.addEventListener("beforeunload", () => {
    if (!dataLoadError) {
      saveAnalytics();
    }
  });

  // Save analytics when page visibility changes (user switches tabs)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && !dataLoadError) {
      saveAnalytics();
    }
  });
});
