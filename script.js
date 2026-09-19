(function() {
  "use strict";

  var toastEl = document.getElementById('toast');
  var toastTimer;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toastEl.classList.remove('show'); }, 2600);
  }

  function burstHearts(n) {
    var wrap = document.getElementById('heartsBurst');
    if (!wrap) return;
    var glyphs = ['💗', '💕', '♡', '💖'];
    for (var i = 0; i < n; i++) {
      (function() {
        var s = document.createElement('span');
        s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        s.style.left = (Math.random() * 100) + 'vw';
        s.style.animationDelay = (Math.random() * 0.6) + 's';
        s.style.fontSize = (16 + Math.random() * 20) + 'px';
        wrap.appendChild(s);
        setTimeout(function() { s.remove(); }, 3200);
      })();
    }
  }

  var track = document.getElementById('marqueeTrack');
  if (track) {
    var PHOTOS = [
      'pic/photo1.jpg', 'pic/photo2.jpg', 'pic/photo3.jpg', 'pic/photo4.jpg',
      'pic/photo5.jpg', 'pic/photo6.jpg', 'pic/photo7.jpg', 'pic/photo8.jpg'
    ];
    
    function buildMarquee() {
      var html = '';
      [0, 1].forEach(function() {
        PHOTOS.forEach(function(src) {
          html += '<img src="' + src + '" alt="" loading="lazy">';
        });
      });
      track.innerHTML = html;
    }
    buildMarquee();
  }

  var openBtn = document.getElementById('openGiftBtn');
  if (openBtn) {
    openBtn.addEventListener('click', function() {
      window.location.href = 'coupons.html';
    });
  }

  var grid = document.getElementById('couponGrid');
  if (grid) {
    var COUPONS = [
      { id: '6', title: 'Game Night', src: 'coupon/6.jpg' },
      { id: '7', title: 'Your Choice', src: 'coupon/7.jpg' },
      { id: '8', title: 'Bad Day Pass', src: 'coupon/8.jpg' },
      { id: '9', title: 'Comfort Pass', src: 'coupon/9.jpg' },
      { id: '10', title: 'One Small Wish', src: 'coupon/10.jpg' },
      { id: '11', title: 'Date Card', src: 'coupon/11.jpg' },
      { id: '12', title: 'Massage', src: 'coupon/12.jpg' },
      { id: '13', title: 'No Complaint Pass', src: 'coupon/13.jpg' }
    ];
    var SECRET = { id: '14', title: 'Forever Favorite', src: 'coupon/14.jpg' };

    var STORAGE_KEY = 'lovebook_coupons_used_v1';
    var SECRET_KEY = 'lovebook_secret_found_v1';

    function loadUsed() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
      catch(e) { return {}; }
    }

    function saveUsed(obj) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } 
      catch(e) {}
    }

    function isSecretFound() {
      try { return localStorage.getItem(SECRET_KEY) === '1'; } 
      catch(e) { return false; }
    }

    function setSecretFound() {
      try { localStorage.setItem(SECRET_KEY, '1'); } 
      catch(e) {}
    }

    var usedMap = loadUsed();

    function fmtDate(iso) {
      var d = new Date(iso);
      var months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return d.getDate() + ' ' + months[d.getMonth()] + ' ' + (d.getFullYear() + 543);
    }

    function renderGrid() {
      grid.innerHTML = '';
      var list = COUPONS.slice();
      if (isSecretFound()) list.push(SECRET);
      
      list.forEach(function(c) {
        var used = usedMap[c.id];
        var btn = document.createElement('button');
        btn.innerHTML = (used ? '<span class="used-ribbon">USED ♡</span>' : '') + '<img src="' + c.src + '" alt="' + c.title + '">';
        btn.addEventListener('click', function() { openModal(c.id); });
        grid.appendChild(btn);
      });
    }
    
    renderGrid();

    var secretTaps = 0;
    var secretTimer;
    document.getElementById('secretTrigger').addEventListener('click', function() {
      secretTaps++;
      clearTimeout(secretTimer);
      secretTimer = setTimeout(function() { secretTaps = 0; }, 1800);
      
      if (secretTaps >= 5) {
        secretTaps = 0;
        if (!isSecretFound()) {
          setSecretFound();
          renderGrid();
          burstHearts(24);
          showToast('เจอคูปองลับแล้ว! 💍');
        } else {
          showToast('เจอคูปองลับไปแล้วนะ ดูในลิสต์ได้เลย');
        }
      }
    });

    var modalBg = document.getElementById('modalBg');
    var canvas = document.getElementById('cpCanvas');
    var ctx = canvas.getContext('2d');
    var useBtn = document.getElementById('useBtn');
    var saveBtn = document.getElementById('saveBtn');
    var modalNote = document.getElementById('modalNote');
    var currentCoupon = null;
    var currentImg = null;

    function roundRect(context, x, y, w, h, r) {
      context.beginPath();
      context.moveTo(x + r, y);
      context.arcTo(x + w, y, x + w, y + h, r);
      context.arcTo(x + w, y + h, x, y + h, r);
      context.arcTo(x, y + h, x, y, r);
      context.arcTo(x, y, x + w, y, r);
      context.closePath();
    }

    function drawCoupon(img, used, usedDate) {
      var W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);

      if (used) {
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.rotate(-0.18);
        ctx.strokeStyle = 'rgba(92,122,82,0.9)';
        ctx.lineWidth = 8;
        roundRect(ctx, -220, -70, 440, 140, 18);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fill();
        ctx.fillStyle = 'rgba(70,100,60,0.95)';
        ctx.font = '700 56px "Trebuchet MS", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('USED ♡', 0, 10);
        ctx.font = '400 24px "Trebuchet MS", sans-serif';
        ctx.fillText(usedDate, 0, 46);
        ctx.restore();
      }
    }

    function openModal(id) {
      var c = COUPONS.concat([SECRET]).find(function(x) { return x.id === id; });
      if (!c) return;
      currentCoupon = c;

      var img = new Image();
      img.onload = function() {
        currentImg = img;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        render();
      };
      img.src = c.src;
      modalBg.classList.add('show');

      function render() {
        var isUsed = !!usedMap[c.id];
        drawCoupon(currentImg, isUsed, isUsed ? fmtDate(usedMap[c.id]) : '');
        
        useBtn.style.display = isUsed ? 'none' : 'block';
        saveBtn.style.display = isUsed ? 'block' : 'none';

        modalNote.textContent = isUsed
          ? 'คูปองนี้ถูกใช้ไปแล้ว เก็บภาพนี้ไว้เป็นความทรงจำได้นะ'
          : 'กด "ใช้คูปองนี้เลย" เมื่อพร้อมใช้จริงๆ (ใช้แล้วจะใช้ซ้ำไม่ได้อีก)';
      }
      openModal._render = render;
    }

    document.getElementById('modalClose').addEventListener('click', closeModal);
    modalBg.addEventListener('click', function(e) { if (e.target === modalBg) closeModal(); });
    
    function closeModal() { 
      modalBg.classList.remove('show'); 
      currentCoupon = null; 
      currentImg = null; 
    }

    useBtn.addEventListener('click', function() {
      if (!currentCoupon) return;
      var ok = confirm('ยืนยันใช้คูปอง "' + currentCoupon.title + '" เลยไหม? เมื่อใช้แล้วจะไม่สามารถใช้ซ้ำได้');
      if (!ok) return;
      usedMap[currentCoupon.id] = new Date().toISOString();
      saveUsed(usedMap);
      renderGrid();
      burstHearts(14);
      showToast('ใช้คูปองแล้ว ขอให้สนุกนะ ♡');
      if (openModal._render) openModal._render();
    });

    saveBtn.addEventListener('click', function() {
      canvas.toBlob(function(blob) {
        if (!blob) return;
        var filename = 'love-coupon-' + (currentCoupon ? currentCoupon.id : 'card') + '.png';
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 4000);
        showToast('บันทึกรูปภาพแล้ว ♡ (ถ้าไม่เด้ง ให้กดค้างที่รูปแล้วเลือกบันทึกแทน)');
      }, 'image/png');
    });
  }

})();