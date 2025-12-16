const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const ELSA_URL =
  "https://vn.elsaspeak.com/tu-vung-tieng-anh-giao-tiep-co-ban-theo-chu-de/?srsltid=AfmBOopwtw1Jrr0laNL9-mBFGJozxNEl-d34i1xgDIF3peInQblZDXGe";

const CAMBRIDGE_BASE =
  "https://dictionary.cambridge.org/vi/dictionary/english/";

const CAMBRIDGE_DOMAIN = "https://dictionary.cambridge.org";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function getAudioUrl(word) {
  try {
    const url = CAMBRIDGE_BASE + encodeURIComponent(word);
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(html);

    const src = $('audio.hdn source[type="audio/mpeg"]').first().attr("src");

    if (!src) return null;

    return CAMBRIDGE_DOMAIN + src;
  } catch (error) {
    console.warn(`⚠️ Không lấy được audio cho: ${word}`);
    return null;
  }
}

async function crawl() {
  const { data: html } = await axios.get(ELSA_URL);
  const $ = cheerio.load(html);

  const result = [];

  const rows = $("figure.wp-block-table table tbody tr");

  for (let i = 1; i < rows.length; i++) {
    const tds = $(rows[i]).find("td");

    const word = $(tds[0]).text().trim();

    if (!word || word === 'Từ vựng') continue;

    console.log(`🔊 Đang lấy audio: ${word}`);

    const audioUrl = await getAudioUrl(word);
    await delay(800); // tránh bị block

    result.push({
      word,
      phonetic: $(tds[1]).text().trim(),
      meaning: $(tds[2]).text().trim(),
      example: $(tds[3]).text().trim(),
      audio: audioUrl,
    });
  }

  fs.writeFileSync(
    "elsa_vocab_with_audio.json",
    JSON.stringify(result, null, 2),
    "utf-8"
  );

  console.log(`✅ Hoàn tất: ${result.length} từ`);
}

crawl();
