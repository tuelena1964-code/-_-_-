(() => {
  const WA_PHONE = "79255171955";

  const DEFAULT_PLACEHOLDER_IMG = (() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f3eadf"/>
          <stop offset="1" stop-color="#efe2d4"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#g)"/>
      <circle cx="400" cy="340" r="120" fill="rgba(155,107,75,0.12)"/>
      <circle cx="400" cy="460" r="160" fill="rgba(155,107,75,0.10)"/>
      <text x="400" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="#81563b" font-weight="700">
        LORDES PRIDE
      </text>
      <text x="400" y="565" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#6f655d">
        фото появится при загрузке
      </text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  })();

  // Меняйте список щенков здесь: добавляйте/убирайте карточки и меняйте поля.
  const PUPPIES = [
    {
      id: "fortune",
      name: "FORTUNE",
      availability: "free", // "free" | "reserved" | "waiting" или строка
      sex: "Кобель",
      age: "8–9 недель",
      color: "Бленхейм",
      tags: ["Для семьи", "Спокойный", "Контактный"],
      description: "Нежный и внимательный кавалер с мягким характером и хорошей концентрацией на человеке.",
      photo: "images/puppy-1.jpg",
    },
    {
      id: "felicity",
      name: "FELICITY",
      availability: "free",
      sex: "Сука",
      age: "8–10 недель",
      color: "Триколор",
      tags: ["Компаньон", "Нежная", "Домашняя"],
      description: "Ласковая девочка-компаньон: легко адаптируется к дому и любит контакт.",
      photo: "images/puppy-2.jpg",
    },
    {
      id: "falcon",
      name: "FALCON",
      availability: "reserved",
      sex: "Кобель",
      age: "9 недель",
      color: "Рубин",
      tags: ["Обучаемый", "Активный", "Уверенный"],
      description: "Уверенный и контактный щенок с интересом к обучению и бытовым звукам.",
      photo: "images/puppy-3.jpg",
    },
    {
      id: "flora",
      name: "FLORA",
      availability: "free",
      sex: "Сука",
      age: "8 недель",
      color: "Чёрно-подпалый",
      tags: ["Мягкая", "Для дома", "Ориентирована на человека"],
      description: "Очень человеко-ориентированная девочка: комфортна в рутине и любит спокойные объятия.",
      photo: "images/puppy-4.jpg",
    },
  ];

  function statusBadge(puppy) {
    if (puppy.badge) return puppy.badge;
    if (typeof puppy.availability !== "string") return "Свободен";

    const av = puppy.availability;
    if (av === "free") return puppy.sex === "Сука" ? "Свободна" : "Свободен";
    if (av === "reserved") return "Зарезервирован";
    if (av === "waiting") return "Лист ожидания";

    // Если указали сразу готовую фразу
    return av;
  }

  function createTag(text) {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = text;
    return span;
  }

  function replaceBrokenImages() {
    const imgs = document.querySelectorAll("img");
    imgs.forEach((img) => {
      img.addEventListener("error", () => {
        if (img.src && img.src.startsWith("data:image/svg+xml")) return;
        img.src = DEFAULT_PLACEHOLDER_IMG;
      });
    });
  }

  function renderPuppies() {
    const list = document.getElementById("puppies-list");
    const tpl = document.getElementById("puppy-card-template");
    if (!list || !tpl) return;

    list.innerHTML = "";

    if (!Array.isArray(PUPPIES) || PUPPIES.length === 0) {
      list.innerHTML = `
        <div class="mini-card" style="grid-column: 1 / -1;">
          Сейчас нет доступных щенков. Напишите нам — подберём вариант и предложим следующую волну.
        </div>
      `;
      return;
    }

    PUPPIES.forEach((p) => {
      const node = tpl.content.firstElementChild.cloneNode(true);
      node.querySelector(".puppy-card__badge").textContent = statusBadge(p);
      node.querySelector(".puppy-card__name").textContent = p.name || "Щенок";
      node.querySelector(".puppy-card__desc").textContent =
        p.description || "Подберём комфортный вариант под ваш ритм жизни.";

      const img = node.querySelector(".puppy-card__img");
      const photo = p.photo || "";
      img.src = photo;
      img.alt = p.alt || `Щенок кавалер кинг чарльз спаниеля ${p.name || ""}`.trim();

      const meta = node.querySelector(".puppy-card__meta");
      meta.innerHTML = "";

      if (p.sex) meta.appendChild(createTag(p.sex));
      if (p.age) meta.appendChild(createTag(`Возраст: ${p.age}`));
      if (p.color) meta.appendChild(createTag(`Окрас: ${p.color}`));
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => {
          if (!t) return;
          meta.appendChild(createTag(t));
        });
      }

      list.appendChild(node);
    });
  }

  function setupReveal() {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    if (elements.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => io.observe(el));
  }

  function setupFAQ() {
    const items = Array.from(document.querySelectorAll(".faq-item"));
    items.forEach((item) => {
      const btn = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!btn || !answer) return;

      const applyOpenState = (open) => {
        item.classList.toggle("active", open);
        if (open) {
          const h = answer.scrollHeight;
          answer.style.maxHeight = `${h}px`;
        } else {
          answer.style.maxHeight = "0px";
        }
      };

      applyOpenState(item.classList.contains("active"));

      const toggle = () => {
        const isOpen = item.classList.contains("active");
        applyOpenState(!isOpen);
      };

      btn.addEventListener("click", toggle);
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  function setupLeadForm() {
    const form = document.getElementById("lead-form");
    const status = document.getElementById("form-status");
    if (!form) return;

    const toDigits = (s) => String(s || "").replace(/\D/g, "");
    const isLikelyPhone = (s) => {
      const digits = toDigits(s);
      return digits.length >= 10;
    };

    const setStatus = (text, isError = false) => {
      if (!status) return;
      status.textContent = text;
      status.style.color = isError ? "#b42318" : "";
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const city = String(fd.get("city") || "").trim();
      const sex = String(fd.get("sex") || "").trim();
      const age = String(fd.get("age") || "").trim();
      const color = String(fd.get("color") || "").trim();
      const message = String(fd.get("message") || "").trim();

      if (!form.checkValidity() || !isLikelyPhone(phone)) {
        setStatus("Проверьте, пожалуйста, поля формы (особенно телефон).", true);
        form.reportValidity();
        return;
      }

      const waMessage = [
        "Здравствуйте! Хочу подобрать щенка LORDES PRIDE.",
        "",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        city ? `Город: ${city}` : null,
        sex ? `Желаемый пол: ${sex}` : null,
        age ? `Возраст/когда забрать: ${age}` : null,
        color ? `Окрас (если важно): ${color}` : null,
        message ? `Пожелания: ${message}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      setStatus("Открываю WhatsApp с вашей заявкой...");
      const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waMessage)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    replaceBrokenImages();
    renderPuppies();
    setupReveal();
    setupFAQ();
    setupLeadForm();
  });
})();

