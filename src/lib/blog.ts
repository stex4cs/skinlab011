export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export interface BlogPost {
  slug: string;
  publishedAt: string;
  coverImage: string;
  author: {
    name: string;
    image: string;
    title: { me: string; en: string; ru: string };
  };
  me: { title: string; excerpt: string; content: ContentBlock[] };
  en: { title: string; excerpt: string; content: ContentBlock[] };
  ru: { title: string; excerpt: string; content: ContentBlock[] };
}

export const blogPosts: BlogPost[] = [
  {
    slug: "proljetna-njega-koze",
    publishedAt: "2026-04-18",
    coverImage: "/images/blog/blog-proljetna-njega-1.jpg",
    author: {
      name: "Neda Vukobrat",
      image: "/images/neda.png",
      title: {
        me: "Osnivač i vlasnica",
        en: "Founder & Owner",
        ru: "Основатель и владелица",
      },
    },
    me: {
      title: "Proljetna njega kože: 5 stručnih savjeta za blistav ten",
      excerpt:
        "Sa dolaskom proljeća, vaša koža zahtijeva posebnu pažnju i obnovu. Otkrijte pet savjeta za revitalizaciju kože nakon zimskih mjeseci.",
      content: [
        {
          type: "paragraph",
          text: "Svake godine, proljeće nas podsjeća da je pravo vrijeme za obnovu – ne samo u prirodi, već i na našoj koži. Nakon zimskih mjeseci ispunjenih centralnim grijanjem, hladnim vjetrom i smanjenom vlagom u vazduhu, koža često izgleda umorno i žedna je pažnje. U SkinLab 011 svakodnevno radimo sa klijentima koji sa sobom nose upravo te zimske tragove. Zato smo odlučili da podijelimo sa vama pet savjeta koji zaista donose razliku.",
        },
        {
          type: "image",
          src: "/images/blog/blog-proljetna-njega-1.jpg",
          alt: "Kozmetički preparati za proljetnu njegu kože",
          caption: "Pravi preparati čine razliku u proljetnoj rutini njege",
        },
        {
          type: "heading",
          text: "1. Eksfolijacija – ključ za svjež izgled",
        },
        {
          type: "paragraph",
          text: "Zima na koži ostavlja sloj mrtvih ćelija koji sprečava prodiranje hranjivnih materija u dublje slojeve. Nježna eksfolijacija jednom do dva puta sedmično uklanja ovaj sloj i priprema kožu za nove preparate. Preporučujemo enzimske eksfolijante (ananas ili papaja enzimi) koji su nježniji od mehaničkih šajbni i savršeni su za osjetljive tipove kože.",
        },
        {
          type: "heading",
          text: "2. Zamijenite zimsku kremu",
        },
        {
          type: "paragraph",
          text: "Teže zimske kreme bogate uljima bile su savršene za hladne dane, ali sa porastom temperature trebate prijeći na lakše formule. Potražite kreme sa hijaluronskom kiselinom i ceramidima – one pružaju duboku hidrataciju bez masnog filma na licu. Vaša koža će vam biti zahvalna.",
        },
        {
          type: "heading",
          text: "3. SPF – vaš najmoćniji saveznik protiv starenja",
        },
        {
          type: "paragraph",
          text: "Sa proljetnim suncem dolazi i veći UV indeks. Zaštita od sunca nije samo ljetnja priča – koristite kremu za lice sa SPF 30 ili više svako jutro, bez izuzetaka. To je, bez ikakve dileme, najvažniji anti-age tretman koji možete uraditi za svoju kožu.",
        },
        {
          type: "image",
          src: "/images/blog/blog-proljetna-njega-2.jpg",
          alt: "Profesionalni tretman lica u SkinLab 011",
          caption: "Profesionalni tretman stimuliše obnovu i sjaj kože",
        },
        {
          type: "heading",
          text: "4. Vitamin C za blistav i ravnomjeran ten",
        },
        {
          type: "paragraph",
          text: "Proljeće je idealno godišnje doba za uvođenje vitamina C u jutarnju rutinu. Ovaj moćni antioksidans pomaže u redukciji pigmentnih fleka koje su se možda pojavile tokom zime, izjednačuje ton kože i pruža dodatnu zaštitu od slobodnih radikala. Nanesite serum sa vitaminom C ujutru, ispod SPF kreme.",
        },
        {
          type: "heading",
          text: "5. Profesionalni salon tretman – investicija u vašu kožu",
        },
        {
          type: "paragraph",
          text: "Jednom na početku svake sezone preporučujemo dubinsko čišćenje u profesionalnom salonu. Naši tretmani u SkinLab 011 prilagođeni su svakom tipu kože – od masne i sklone aknama, do suhe i osjetljive. U samo jednom tretmanu možemo ukloniti nečistoće nakupljene tokom zime, stimulisati cirkulaciju i obnoviti prirodni sjaj kože.",
        },
        {
          type: "paragraph",
          text: "Proljetna njega kože ne mora biti komplikovana – ali mora biti dosljedna. Uz nekoliko promjena u vašoj rutini i povremeni posjet salonu, vaša koža može izgledati blistavo tokom cijele sezone. Slobodno nas kontaktirajte za besplatne konsultacije ili zakažite vaš proljetni tretman odmah.",
        },
      ],
    },
    en: {
      title: "Spring Skincare: 5 Expert Tips for a Glowing Complexion",
      excerpt:
        "As spring arrives, your skin calls for renewal and special care. Discover five expert tips to revitalize your complexion after the winter months.",
      content: [
        {
          type: "paragraph",
          text: "Every year, spring reminds us that it's time for a fresh start — not just in nature, but for our skin as well. After months of central heating, cold winds, and reduced humidity, our skin often looks tired, dull, and in need of attention. At SkinLab 011, we work daily with clients who carry exactly those winter marks on their skin. That's why we decided to share five tips that truly make a difference.",
        },
        {
          type: "image",
          src: "/images/blog/blog-proljetna-njega-1.jpg",
          alt: "Skincare products for spring routine",
          caption: "The right products make all the difference in your spring routine",
        },
        {
          type: "heading",
          text: "1. Exfoliation – The Key to a Fresh Look",
        },
        {
          type: "paragraph",
          text: "Winter leaves a layer of dead skin cells that prevents nutrients from reaching the deeper layers of the skin. Gentle exfoliation one to two times a week removes this layer and prepares the skin for new products. We recommend enzyme exfoliants (pineapple or papaya enzymes) which are gentler than mechanical scrubs and perfect for sensitive skin types.",
        },
        {
          type: "heading",
          text: "2. Swap Your Winter Moisturizer",
        },
        {
          type: "paragraph",
          text: "Heavy winter creams rich in oils were perfect for cold days, but as temperatures rise, it's time to switch to lighter formulas. Look for creams with hyaluronic acid and ceramides — they provide deep hydration without a greasy film on your face. Your skin will thank you.",
        },
        {
          type: "heading",
          text: "3. SPF – Your Most Powerful Anti-Aging Ally",
        },
        {
          type: "paragraph",
          text: "With spring sunshine comes a higher UV index. Sun protection isn't just a summer story — use a face cream with SPF 30 or higher every morning, without exception. This is, without a doubt, the most important anti-aging treatment you can do for your skin.",
        },
        {
          type: "image",
          src: "/images/blog/blog-proljetna-njega-2.jpg",
          alt: "Professional facial treatment at SkinLab 011",
          caption: "A professional treatment stimulates skin renewal and radiance",
        },
        {
          type: "heading",
          text: "4. Vitamin C for a Bright and Even Complexion",
        },
        {
          type: "paragraph",
          text: "Spring is the ideal season to introduce vitamin C into your morning routine. This powerful antioxidant helps reduce pigmentation spots that may have appeared during winter, evens out skin tone, and provides additional protection against free radicals. Apply a vitamin C serum in the morning, under your SPF cream.",
        },
        {
          type: "heading",
          text: "5. Professional Salon Treatment – An Investment in Your Skin",
        },
        {
          type: "paragraph",
          text: "Once at the beginning of each season, we recommend a professional deep-cleansing treatment at a salon. Our treatments at SkinLab 011 are tailored to every skin type — from oily and acne-prone to dry and sensitive. In just one treatment, we can remove impurities accumulated during winter, stimulate circulation, and restore the natural radiance of your skin.",
        },
        {
          type: "paragraph",
          text: "Spring skincare doesn't have to be complicated — but it does need to be consistent. With a few changes to your routine and an occasional salon visit, your skin can look radiant throughout the entire season. Feel free to contact us for a free consultation or book your spring treatment right away.",
        },
      ],
    },
    ru: {
      title: "Весенний уход за кожей: 5 советов эксперта для сияющей кожи",
      excerpt:
        "С приходом весны ваша кожа нуждается в обновлении и особом уходе. Узнайте пять экспертных советов по восстановлению кожи после зимних месяцев.",
      content: [
        {
          type: "paragraph",
          text: "Каждый год весна напоминает нам о том, что пора начать всё заново — не только в природе, но и для нашей кожи. После месяцев центрального отопления, холодных ветров и низкой влажности воздуха кожа часто выглядит усталой, тусклой и нуждается во внимании. В SkinLab 011 мы ежедневно работаем с клиентами, на коже которых видны именно такие «зимние следы». Именно поэтому мы решили поделиться пятью советами, которые действительно имеют значение.",
        },
        {
          type: "image",
          src: "/images/blog/blog-proljetna-njega-1.jpg",
          alt: "Косметические средства для весеннего ухода",
          caption: "Правильные средства — основа вашего весеннего ухода",
        },
        {
          type: "heading",
          text: "1. Эксфолиация — ключ к свежему виду",
        },
        {
          type: "paragraph",
          text: "Зима оставляет на коже слой отмерших клеток, который препятствует проникновению питательных веществ в глубокие слои. Нежная эксфолиация один-два раза в неделю удаляет этот слой и подготавливает кожу к новым средствам. Мы рекомендуем ферментные эксфолианты (энзимы ананаса или папайи), которые мягче механических скрабов и идеально подходят для чувствительной кожи.",
        },
        {
          type: "heading",
          text: "2. Смените зимний крем",
        },
        {
          type: "paragraph",
          text: "Насыщенные зимние кремы с маслами отлично работали в холодные дни, но с повышением температуры пришло время перейти на более лёгкие формулы. Ищите кремы с гиалуроновой кислотой и церамидами — они обеспечивают глубокое увлажнение без жирного ощущения. Ваша кожа скажет вам спасибо.",
        },
        {
          type: "heading",
          text: "3. SPF — ваш главный союзник против старения",
        },
        {
          type: "paragraph",
          text: "С весенним солнцем приходит и повышенный UV-индекс. Защита от солнца — это не только летняя история. Используйте крем для лица с SPF 30 или выше каждое утро, без исключений. Это, без сомнения, самая важная антивозрастная процедура, которую вы можете сделать для своей кожи.",
        },
        {
          type: "image",
          src: "/images/blog/blog-proljetna-njega-2.jpg",
          alt: "Профессиональная процедура для лица в SkinLab 011",
          caption: "Профессиональная процедура стимулирует обновление и сияние кожи",
        },
        {
          type: "heading",
          text: "4. Витамин C для сияющего и ровного тона",
        },
        {
          type: "paragraph",
          text: "Весна — идеальное время для введения витамина C в утренний уход. Этот мощный антиоксидант помогает уменьшить пигментные пятна, которые могли появиться зимой, выравнивает тон кожи и обеспечивает дополнительную защиту от свободных радикалов. Наносите сыворотку с витамином C утром, под крем с SPF.",
        },
        {
          type: "heading",
          text: "5. Профессиональная процедура в салоне — инвестиция в кожу",
        },
        {
          type: "paragraph",
          text: "Раз в начале каждого сезона мы рекомендуем профессиональную глубокую очищающую процедуру в салоне. Наши процедуры в SkinLab 011 адаптированы к каждому типу кожи — от жирной и склонной к акне до сухой и чувствительной. Всего за одну процедуру мы можем удалить загрязнения, накопившиеся за зиму, стимулировать кровообращение и восстановить естественное сияние кожи.",
        },
        {
          type: "paragraph",
          text: "Весенний уход за кожей не должен быть сложным — но он должен быть последовательным. Несколько изменений в вашем уходе и периодическое посещение салона позволят вашей коже сиять на протяжении всего сезона. Свяжитесь с нами для бесплатной консультации или запишитесь на весеннюю процедуру прямо сейчас.",
        },
      ],
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatBlogDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  if (locale === "ru") {
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  }
  if (locale === "en") {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  }
  return date.toLocaleDateString("sr-Latn", { day: "numeric", month: "long", year: "numeric" });
}
