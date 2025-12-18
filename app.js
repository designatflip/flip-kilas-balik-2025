// Vanilla JavaScript - No React needed
document.addEventListener("DOMContentLoaded", async function () {
  // Reset scroll position to top on page load
  window.scrollTo(0, 0);

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
  let profitShareReceiver = "[profit_share_receiver]"; // Default fallback
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
      } else if (data) {
        if (data.user_name) {
          userName = data.user_name;
        }
        if (data.amount_saved !== null && data.amount_saved !== undefined) {
          amountSavedRaw = data.amount_saved;
          amountSaved = `Rp ${data.amount_saved.toLocaleString("id-ID")}`;
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
          cashbackReceived = `Rp ${data.cashback_received_amount.toLocaleString(
            "id-ID"
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
          profitShareReceiver = `Rp ${data.profit_share_receiver.toLocaleString(
            "id-ID"
          )}`;
        }
        if (
          data.unique_code_donation_amount !== null &&
          data.unique_code_donation_amount !== undefined
        ) {
          uniqueCodeDonationRaw = data.unique_code_donation_amount;
          uniqueCodeDonation = `Rp ${data.unique_code_donation_amount.toLocaleString(
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
    }
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
    "assets/asset 23.png",
    "assets/asset 24.png",
    "assets/asset 25.png",
    "assets/asset 26.png",
    "assets/asset 27.png",
    "assets/asset 28.png",
    "assets/asset 29.png",
    "assets/asset 30.png",
  ];

  const root = document.getElementById("root");

  // Create app container
  const appContainer = document.createElement("div");
  appContainer.className = "app-container";

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content-wrapper";

  // Create image elements
  assets.forEach((src, index) => {
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Asset ${index + 1}`;
    img.loading = "lazy";

    imageContainer.appendChild(img);

    // Add amount saved overlay on asset 14 (index 13)
    if (index === 13) {
      const amountOverlay = document.createElement("div");
      amountOverlay.className = "amount-overlay";
      amountOverlay.innerHTML = `<div style="font-size: 20px; margin-bottom: 10px;">amount_saved</div><strong>${amountSaved}</strong>`;
      imageContainer.appendChild(amountOverlay);
    }

    // Add flip deals and cashback data overlay on asset 17 (index 15)
    if (index === 15) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `
        <div style="font-size: 20px; margin-bottom: 10px;">flip_deals_purchase_trx</div>
        <strong style="margin-bottom: 20px; display: block;">${flipDealsPurchase}</strong>
        <div style="font-size: 20px; margin-bottom: 10px;">cashback_received_amount</div>
        <strong>${cashbackReceived}</strong>
      `;
      imageContainer.appendChild(dataOverlay);
    }

    // Add ewallet topup count overlay on asset 19 (index 17)
    if (index === 17) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `<div style="font-size: 20px; margin-bottom: 10px;">ewallet_topup_count</div><strong>${ewalletTopupCount}</strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add qris transaction count overlay on asset 20 (index 18)
    if (index === 18) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `<div style="font-size: 20px; margin-bottom: 10px;">qris_transaction_count</div><strong>${qrisTransactionCount}</strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add unit owned overlay on asset 21 (index 19)
    if (index === 19) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `<div style="font-size: 20px; margin-bottom: 10px;">unit_owned</div><strong>${unitOwned}</strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add profit share receiver overlay on asset 22 (index 20)
    if (index === 20) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `<div style="font-size: 20px; margin-bottom: 10px;">profit_share_receiver</div><strong>${profitShareReceiver}</strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add unique code donation overlay on asset 24 (index 22)
    if (index === 22) {
      const dataOverlay = document.createElement("div");
      dataOverlay.className = "amount-overlay";
      dataOverlay.innerHTML = `<div style="font-size: 20px; margin-bottom: 10px;">unique_code_donation_amount</div><strong>${uniqueCodeDonation}</strong>`;
      imageContainer.appendChild(dataOverlay);
    }

    // Add data table overlay on asset 26 (index 24)
    if (index === 24) {
      const tableOverlay = document.createElement("div");
      tableOverlay.className = "table-overlay";
      tableOverlay.innerHTML = `
        <table style="width: 100%; color: white; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2);">qris_transaction_count</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>${qrisTransactionCountRaw}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2);">ewallet_topup_count</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>${ewalletTopupCountRaw}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2);">flip_deals_purchase_trx</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>${flipDealsPurchaseRaw}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2);">cashback_received_amount</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>${cashbackReceivedRaw}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2);">amount_saved</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>${amountSavedRaw}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2);">gold_transaction_count</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>${goldTransactionCount}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2);">unit_owned</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>${unitOwnedRaw}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2);">profit_share_receiver</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>${profitShareReceiverRaw}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.2);">unique_code_donation_amount</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>${uniqueCodeDonationRaw}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: left;">donation_amount</td>
            <td style="padding: 8px; text-align: right;"><strong>${donationAmount}</strong></td>
          </tr>
        </table>
      `;
      imageContainer.appendChild(tableOverlay);
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
      textContainer.style.backgroundColor = "#1A2022";

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

    // Add text after asset 15 (index 14)
    if (index === 14) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent = "Kamu bisa jadiin belanjaan jadi cuan";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 17 (index 15)
    if (index === 15) {
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
        "Jajan es krim pas lagi bad day, jalan-jalan sambil nikmatin angin sepoi-sepoi atau beli barang lucu yang bikin mood naik. ";
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

    // Add text after asset 21 (index 19)
    if (index === 19) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Kamu juga gak lupa buat nabung & investasi buat masa depan ";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 22 (index 20)
    if (index === 20) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Mungkin jumlahnya belum sesuai yang kamu mau, yang penting udah mulai";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 23 (index 21)
    if (index === 21) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Selain itu, kamu juga masih sempat berbagi buat orang lain";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 24 (index 22)
    if (index === 22) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#3A5988";
      textContainer.textContent =
        "Peduli itu bukan soal seberapa besar yang kamu kasih, tapi soal kamu masih ingat ada orang lain, meski kamu masih berjuang juga.";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 25 (index 23)
    if (index === 23) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#C7D7EE";

      textContainer.textContent = "Mungkin gak kerasa, tapi liat deh...";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 26 (index 24)
    if (index === 24) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#C7D7EE";
      textContainer.style.color = "#222222";

      textContainer.textContent =
        "Setelah diinget lagi, ternyata banyak banget kan, yang udah kamu lakuin?";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 27 (index 25)
    if (index === 25) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#C7D7EE";
      textContainer.style.color = "#222222";
      textContainer.textContent =
        "Makasih ya udah gak menyerah, meski ada masanya pengen banget. ";
      contentWrapper.appendChild(textContainer);
    }

    // Add text after asset 28 (index 26)
    if (index === 26) {
      const textContainer = document.createElement("div");
      textContainer.className = "text-container";
      textContainer.style.backgroundColor = "#C7D7EE";
      textContainer.style.color = "#222222";
      textContainer.textContent =
        "Kalau ada yang belum tercapai, kita coba lagi di tahun 2026.";
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

  const shareBtn = document.createElement("img");
  shareBtn.src = "assets/navigation/Share_btn.png";
  shareBtn.alt = "Share";
  shareBtn.className = "nav-btn share-btn";

  const galleryBtn = document.createElement("img");
  galleryBtn.src = "assets/navigation/Gallery_btn.png";
  galleryBtn.alt = "Gallery";
  galleryBtn.className = "nav-btn gallery-btn";

  navButtons.appendChild(shareBtn);
  navButtons.appendChild(galleryBtn);

  envelopeContainer.appendChild(navButtons);
  appContainer.appendChild(envelopeContainer);

  // Create back button
  const backButton = document.createElement("div");
  backButton.className = "back-button";
  backButton.innerHTML = "&lt;";
  backButton.addEventListener("click", () => {
    const win = window;
    if (win.ReactNativeWebView) {
      win.ReactNativeWebView.postMessage("exit-page");
    }
  });
  appContainer.appendChild(backButton);

  root.appendChild(appContainer);
});
