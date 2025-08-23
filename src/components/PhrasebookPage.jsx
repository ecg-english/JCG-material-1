import React, { useMemo, useState, useEffect } from "react";

// ======= デモ用データ（ざっくり） =======
const DATA = [
  {
    id: "restaurant",
    emoji: "🍽️",
    title: "Restaurant Conversation",
    sections: [
      {
        id: "before-ordering",
        title: "1. Before Ordering",
        phrases: [
          { 
            jp: "今日は混んでますか？", 
            en: "Is it crowded today?", 
            ro: "Kyō wa kondemasu ka?",
            context: "混雑状況を確認することで、待ち時間の目安を把握できます。日本では混雑時でも静かに待つことがマナーです。",
            example: "客：今日は混んでますか？\n店員：はい、少しお待ちいただくことになります。\n客：どのくらいですか？\n店員：30分程度です。"
          },
          { 
            jp: "窓際の席が空いていたら嬉しいんですが…", 
            en: "If a window seat is available, I'd love that.", 
            ro: "Madowa no seki ga aite itara ureshii n desu ga…",
            context: "「〜たら嬉しいんですが」は控えめな希望を表す丁寧な表現です。直接的な要求よりも相手に配慮した印象を与えます。",
            example: "客：窓際の席が空いていたら嬉しいんですが…\n店員：申し訳ございませんが、窓際は予約で埋まっております。\n客：そうですか、では普通の席でお願いします。"
          },
          { 
            jp: "予約していた〇〇です。", 
            en: "I have a reservation under ____.", 
            ro: "Yoyaku shiteita ____ desu.",
            context: "予約時の名前を伝える際の定番表現です。予約時間に遅れないよう、5分前には到着するのがマナーです。",
            example: "客：予約していた田中です。\n店員：田中様ですね。お待ちしておりました。\n客：よろしくお願いします。"
          },
          { 
            jp: "このお店、初めてなんですが…", 
            en: "It's my first time here…", 
            ro: "Kono omise, hajimete nan desu ga…",
            context: "初回利用であることを伝えることで、店員がより丁寧に案内してくれることがあります。おすすめメニューを聞くきっかけにもなります。",
            example: "客：このお店、初めてなんですが…\n店員：いらっしゃいませ！当店の特徴をご説明いたします。\n客：おすすめは何ですか？"
          },
          { 
            jp: "一人なんですが、カウンター席ありますか？", 
            en: "It's just me. Do you have a counter seat?", 
            ro: "Hitori nan desu ga, kauntā seki arimasu ka?",
            context: "一人での来店時は、カウンター席の方が入りやすいことが多いです。日本では一人での外食も一般的で、気後れする必要はありません。",
            example: "客：一人なんですが、カウンター席ありますか？\n店員：はい、カウンター席ならすぐにお座りいただけます。\n客：ありがとうございます。"
          },
          { 
            jp: "予約なしでも入れますか？", 
            en: "Can I come in without a reservation?", 
            ro: "Yoyaku nashi demo hairemasu ka?",
            context: "予約なしでの来店を確認する表現です。混雑時は断られることもありますが、空いていれば入店可能です。",
            example: "客：予約なしでも入れますか？\n店員：はい、お席をご用意いたします。\n客：ありがとうございます。"
          },
          { 
            jp: "今、どれくらい待ちますか？", 
            en: "About how long is the wait now?", 
            ro: "Ima, dorekurai machimasu ka?",
            context: "待ち時間を確認する際の表現です。混雑時は正確な時間が分からない場合もありますが、目安を聞くことで予定を調整できます。",
            example: "客：今、どれくらい待ちますか？\n店員：申し訳ございませんが、1時間程度お待ちいただくことになります。\n客：分かりました、待ちます。"
          },
          { 
            jp: "ランチタイムは何時までですか？", 
            en: "Until what time is the lunch menu?", 
            ro: "Ranchi taimu wa nanji made desu ka?",
            context: "ランチメニューの提供時間を確認する表現です。多くの店では14時頃までがランチタイムです。",
            example: "客：ランチタイムは何時までですか？\n店員：ランチメニューは14時までとなっております。\n客：まだ間に合いますね。"
          },
          { 
            jp: "今日の日替わりセットは何ですか？", 
            en: "What's today's special set?", 
            ro: "Kyō no higawari setto wa nan desu ka?",
            context: "日替わりメニューを確認する表現です。季節の食材を使った特別な料理を楽しめることが多いです。",
            example: "客：今日の日替わりセットは何ですか？\n店員：今日は春野菜の天ぷらセットとなっております。\n客：それにします。"
          },
          { 
            jp: "個室は利用できますか？", 
            en: "Do you have private rooms?", 
            ro: "Koshitsu wa riyō dekimasu ka?",
            context: "個室の利用を確認する表現です。商談や記念日など、静かな空間が必要な場合に使用します。",
            example: "客：個室は利用できますか？\n店員：はい、個室もご用意できます。\n客：予約でお願いします。"
          },
          { 
            jp: "禁煙席はありますか？", 
            en: "Do you have non‑smoking seats?", 
            ro: "Kinnen seki wa arimasu ka?",
            context: "禁煙席の有無を確認する表現です。2020年以降、多くの店で全面禁煙となっています。",
            example: "客：禁煙席はありますか？\n店員：申し訳ございませんが、当店は全面禁煙となっております。\n客：分かりました。"
          },
          { 
            jp: "テイクアウトはできますか？", 
            en: "Do you do takeout?", 
            ro: "Teikuauto wa dekimasu ka?",
            context: "テイクアウトの可否を確認する表現です。コロナ禍以降、多くの店でテイクアウトサービスを開始しています。",
            example: "客：テイクアウトはできますか？\n店員：はい、テイクアウトも承っております。\n客：では、お持ち帰りでお願いします。"
          },
          { 
            jp: "英語のメニューはありますか？", 
            en: "Do you have an English menu?", 
            ro: "Eigo no menyū wa arimasu ka?",
            context: "英語メニューの有無を確認する表現です。観光地や国際的な店では英語メニューを用意していることが多いです。",
            example: "客：英語のメニューはありますか？\n店員：はい、英語メニューもご用意しております。\n客：ありがとうございます。"
          },
          { 
            jp: "お水をもう一杯いただけますか？", 
            en: "Could I get another glass of water?", 
            ro: "Omizu o mō ippai itadakemasu ka?",
            context: "追加の飲み物を依頼する表現です。日本では水は無料で提供されることが多いです。",
            example: "客：お水をもう一杯いただけますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "お手洗いはどこにありますか？", 
            en: "Where is the restroom?", 
            ro: "Otearai wa doko ni arimasu ka?",
            context: "トイレの場所を確認する表現です。日本では「お手洗い」が丁寧な表現として使われます。",
            example: "客：お手洗いはどこにありますか？\n店員：奥の廊下をまっすぐ行って、右側にございます。\n客：ありがとうございます。"
          },
        ],
      },
      {
        id: "ordering",
        title: "2. Ordering",
        phrases: [
          { 
            jp: "おすすめは何ですか？", 
            en: "What do you recommend?", 
            ro: "Osusume wa nan desu ka?",
            context: "店員におすすめを聞く定番表現です。店の特徴や季節の料理を教えてもらえることがあります。",
            example: "客：おすすめは何ですか？\n店員：当店の名物、海鮮丼はいかがでしょうか？\n客：それにします。"
          },
          { 
            jp: "これを一つお願いします。", 
            en: "I'd like this one, please.", 
            ro: "Kore o hitotsu onegaishimasu.",
            context: "メニューを指さしながら注文する際の表現です。指さしは世界共通のコミュニケーション方法です。",
            example: "客：これを一つお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "辛さは控えめにできますか？", 
            en: "Can you make it less spicy?", 
            ro: "Karasa wa hikaeme ni dekimasu ka?",
            context: "辛さの調整を依頼する表現です。日本の料理は比較的マイルドですが、辛い料理もあります。",
            example: "客：辛さは控えめにできますか？\n店員：はい、辛さを調整いたします。\n客：ありがとうございます。"
          },
          { 
            jp: "アレルギーがあるので〇〇抜きでお願いします。", 
            en: "I'm allergic to ____. Please leave it out.", 
            ro: "Arerugī ga aru no de ____ nuki de onegaishimasu.",
            context: "アレルギーがある場合の重要な表現です。命に関わることもあるので、しっかりと伝えることが大切です。",
            example: "客：アレルギーがあるので卵抜きでお願いします。\n店員：承知いたしました。卵は使用いたしません。\n客：ありがとうございます。"
          },
          { 
            jp: "取り皿をいただけますか？", 
            en: "Could we have some extra small plates?", 
            ro: "Torizara o itadakemasu ka?",
            context: "料理を分け合う際に必要な小皿を依頼する表現です。日本の料理は分け合って食べることも多いです。",
            example: "客：取り皿をいただけますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "お水をもう一杯いただけますか？", 
            en: "Could I get another glass of water?", 
            ro: "Omizu o mō ippai itadakemasu ka?",
            context: "追加の飲み物を依頼する表現です。日本では水は無料で提供されることが多いです。",
            example: "客：お水をもう一杯いただけますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
        ],
      },
      {
        id: "reactions",
        title: "3. Mealtime Reactions",
        phrases: [
          { 
            jp: "すごく美味しいです！", 
            en: "This is really delicious!", 
            ro: "Sugoku oishii desu!",
            context: "料理に対する率直な感想を伝える表現です。日本では「いただきます」「ごちそうさま」と共に、料理への感謝を表すことが大切です。",
            example: "客：すごく美味しいです！\n店員：ありがとうございます。お気に入りいただけて嬉しいです。\n客：また来ます！"
          },
          { 
            jp: "思ったより量が多いですね。", 
            en: "It's more than I expected.", 
            ro: "Omotta yori ryō ga ōi desu ne.",
            context: "量についての感想を伝える表現です。日本では「もったいない」という文化があるため、残す場合は事前に伝えるのがマナーです。",
            example: "客：思ったより量が多いですね。\n店員：お持ち帰りも承っておりますが、いかがでしょうか？\n客：ありがとうございます。"
          },
          { 
            jp: "すみません、少し冷めているようです。", 
            en: "Excuse me, it seems a bit cold.", 
            ro: "Sumimasen, sukoshi samete iru yō desu.",
            context: "料理に問題がある場合の丁寧な伝え方です。感情的にならず、事実を伝えることで適切に対応してもらえます。",
            example: "客：すみません、少し冷めているようです。\n店員：申し訳ございません。温め直してお持ちいたします。\n客：ありがとうございます。"
          },
        ],
      },
      {
        id: "problems",
        title: "4. Problems & Requests",
        phrases: [
          { 
            jp: "注文がまだ来ていないようです。", 
            en: "Our order hasn't arrived yet.", 
            ro: "Chūmon ga mada kite inai yō desu.",
            context: "注文が遅い場合の丁寧な伝え方です。感情的にならず、事実を伝えることで適切に対応してもらえます。",
            example: "客：注文がまだ来ていないようです。\n店員：申し訳ございません。確認いたします。\n客：ありがとうございます。"
          },
          { 
            jp: "別の料理に変えてもいいですか？", 
            en: "May I change my order?", 
            ro: "Betsu no ryōri ni kaete mo ii desu ka?",
            context: "注文変更を依頼する際の表現です。調理が始まっている場合は変更できないこともあります。",
            example: "客：別の料理に変えてもいいですか？\n店員：申し訳ございませんが、調理が始まっております。\n客：分かりました。"
          },
          { 
            jp: "ナイフをもう一本いただけますか？", 
            en: "Could I have another knife?", 
            ro: "Naifu o mō ippon itadakemasu ka?",
            context: "追加の食器を依頼する際の表現です。日本では箸が主流ですが、洋食ではナイフやフォークも使用します。",
            example: "客：ナイフをもう一本いただけますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
        ],
      },
      {
        id: "paying",
        title: "5. Paying the Bill",
        phrases: [
          { 
            jp: "お会計をお願いします。", 
            en: "Check, please.", 
            ro: "Okaikei o onegaishimasu.",
            context: "日本では手を上げて店員を呼ぶのは失礼とされています。この表現で静かに声をかけるのがマナーです。",
            example: "客：お会計をお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "別々に支払えますか？", 
            en: "Can we pay separately?", 
            ro: "Betsubetsu ni shiharaemasu ka?",
            context: "複数人での食事時に使用する表現です。日本では割り勘が一般的ですが、事前に確認するのがマナーです。",
            example: "客：別々に支払えますか？\n店員：はい、別々にお支払いいただけます。\n客：ありがとうございます。"
          },
          { 
            jp: "カードは使えますか？", 
            en: "Do you accept cards?", 
            ro: "Kādo wa tsukaemasu ka?",
            context: "支払い方法を確認する表現です。日本では現金が主流ですが、最近はカード決済も普及しています。",
            example: "客：カードは使えますか？\n店員：はい、クレジットカードをお使いいただけます。\n客：ありがとうございます。"
          },
          { 
            jp: "レシートをください。", 
            en: "Please give me the receipt.", 
            ro: "Reshīto o kudasai.",
            context: "領収書を依頼する表現です。経費精算や記録のために必要です。",
            example: "客：レシートをください。\n店員：はい、お渡しいたします。\n客：ありがとうございます。"
          },
        ],
      },
      {
        id: "additional",
        title: "6. Additional Expressions",
        phrases: [
          { 
            jp: "おいしいです！", 
            en: "It's delicious!", 
            ro: "Oishii desu!",
            context: "料理に対する基本的な感想を伝える表現です。",
            example: "客：おいしいです！\n店員：ありがとうございます。"
          },
          { 
            jp: "ありがとうございました。", 
            en: "Thank you very much.", 
            ro: "Arigatō gozaimashita.",
            context: "食事を終えて店を出る際の感謝の表現です。",
            example: "客：ありがとうございました。\n店員：ありがとうございました。またお越しください。"
          },
        ],
      },
    ],
  },
  {
    id: "shopping",
    emoji: "🛍️",
    title: "Shopping/Purchase",
    sections: [
      {
        id: "entering",
        title: "1. Entering/Browsing",
        phrases: [
          { jp: "見ているだけです。", en: "I'm just looking, thanks.", ro: "Miteiru dake desu." },
          { jp: "これ、試着できますか？", en: "Can I try this on?", ro: "Kore, shichaku dekimasu ka?" },
          { jp: "別の色はありますか？", en: "Do you have another color?", ro: "Betsu no iro wa arimasu ka?" },
        ],
      },
      {
        id: "price",
        title: "2. Price/Discount/Points",
        phrases: [
          { jp: "これ、いくらですか？", en: "How much is this?", ro: "Kore, ikura desu ka?" },
          { jp: "セールはいつまでですか？", en: "Until when is the sale?", ro: "Sēru wa itsu made desu ka?" },
          { jp: "ポイントカードは使えますか？", en: "Can I use my point card?", ro: "Pointo kādo wa tsukaemasu ka?" },
        ],
      },
      {
        id: "checkout",
        title: "3. Checkout",
        phrases: [
          { jp: "袋はいりません。", en: "I don't need a bag.", ro: "Fukuro wa irimasen." },
          { jp: "領収書をお願いします。", en: "A receipt, please.", ro: "Ryōshūsho o onegaishimasu." },
          { jp: "クレジットでお願いします。", en: "Credit card, please.", ro: "Kurejitto de onegaishimasu." },
        ],
      },
    ],
  },
  {
    id: "transportation",
    emoji: "🚇",
    title: "Transportation/Movement",
    sections: [
      {
        id: "train",
        title: "1. Train/Subway",
        phrases: [
          { jp: "〇〇駅までいくらですか？", en: "How much is it to ____ station?", ro: "____ eki made ikura desu ka?" },
          { jp: "この電車は〇〇行きですか？", en: "Does this train go to ____?", ro: "Kono densha wa ____ yuki desu ka?" },
          { jp: "次の電車は何時ですか？", en: "What time is the next train?", ro: "Tsugi no densha wa nanji desu ka?" },
          { jp: "定期券を買いたいんですが。", en: "I'd like to buy a commuter pass.", ro: "Teikiken o kaitai n desu ga." },
        ],
      },
      {
        id: "bus",
        title: "2. Bus",
        phrases: [
          { jp: "〇〇まで行くバスはありますか？", en: "Is there a bus to ____?", ro: "____ made iku basu wa arimasu ka?" },
          { jp: "バス停はどこですか？", en: "Where is the bus stop?", ro: "Basutei wa doko desu ka?" },
          { jp: "運賃はいくらですか？", en: "How much is the fare?", ro: "Unchin wa ikura desu ka?" },
        ],
      },
      {
        id: "taxi",
        title: "3. Taxi",
        phrases: [
          { jp: "〇〇までお願いします。", en: "To ____, please.", ro: "____ made onegaishimasu." },
          { jp: "料金はいくらくらいですか？", en: "About how much will it cost?", ro: "Ryōkin wa ikura kurai desu ka?" },
          { jp: "領収書をください。", en: "Please give me a receipt.", ro: "Ryōshūsho o kudasai." },
        ],
      },
    ],
  },
  {
    id: "daily-life",
    emoji: "🏠",
    title: "Daily Life",
    sections: [
      {
        id: "greetings",
        title: "1. Greetings/Introductions",
        phrases: [
          { jp: "はじめまして、〇〇です。", en: "Nice to meet you, I'm ____.", ro: "Hajimemashite, ____ desu." },
          { jp: "よろしくお願いします。", en: "Please treat me well.", ro: "Yoroshiku onegaishimasu." },
          { jp: "お疲れ様です。", en: "Thank you for your hard work.", ro: "Otsukaresama desu." },
          { jp: "おはようございます。", en: "Good morning.", ro: "Ohayō gozaimasu." },
          { jp: "こんにちは。", en: "Hello.", ro: "Konnichiwa." },
          { jp: "こんばんは。", en: "Good evening.", ro: "Konbanwa." },
        ],
      },
      {
        id: "weather",
        title: "2. Weather/Climate",
        phrases: [
          { jp: "今日はいい天気ですね。", en: "It's nice weather today.", ro: "Kyō wa ii tenki desu ne." },
          { jp: "明日は雨が降るそうです。", en: "I heard it will rain tomorrow.", ro: "Ashita wa ame ga furu sō desu." },
          { jp: "暑いですね。", en: "It's hot, isn't it?", ro: "Atsui desu ne." },
          { jp: "寒いですね。", en: "It's cold, isn't it?", ro: "Samui desu ne." },
        ],
      },
      {
        id: "hobbies",
        title: "3. Hobbies/Interests",
        phrases: [
          { jp: "趣味は何ですか？", en: "What are your hobbies?", ro: "Shumi wa nan desu ka?" },
          { jp: "〇〇が好きです。", en: "I like ____.", ro: "____ ga suki desu." },
          { jp: "〇〇を習っています。", en: "I'm learning ____.", ro: "____ o naratte imasu." },
          { jp: "週末は何をしますか？", en: "What do you do on weekends?", ro: "Shūmatsu wa nani o shimasu ka?" },
        ],
      },
    ],
  },
];

// ======= ユーティリティ =======
const speak = (text /*: string*/ , lang = "ja-JP") => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  window.speechSynthesis.speak(u);
};

/**
 * クリップボードに安全にコピー（権限NGでもフェイルセーフ）
 * - セキュアコンテキストかつ Clipboard API が許可されていればそれを使用
 * - それ以外は一時テキストエリア＋execCommand でフォールバック
 * - いずれも失敗したら false を返す
 */
async function safeCopyText(text) {
  // 1) Trusted Clipboard API（HTTPS & 許可済）
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // 続けてフォールバック
  }

  // 2) フォールバック：一時テキストエリア
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; // iOSでもスクロールしない
    ta.style.opacity = "0";
    ta.style.pointerEvents = "none";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand && document.execCommand("copy");
    document.body.removeChild(ta);
    return !!ok;
  } catch (e) {
    return false;
  }
}

const useLocal = /* <T,> */ (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
};

// ======= UIパーツ =======
function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 select-none cursor-pointer">
      <span className="text-sm text-zinc-500">{label}</span>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-zinc-300"}`}
        onClick={onChange}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </span>
    </label>
  );
}

function Section({ title, phrases, learnedPhrases, updateLearnedPhrases }) {
  const [open, setOpen] = useState(true);
  const [showEn, setShowEn] = useLocal(`showEn`, true);
  const [showRo, setShowRo] = useLocal(`showRo`, false);
  const [copyState, setCopyState] = useState(null); // {i:number, ok:boolean}
  const [expandedActions, setExpandedActions] = useState({}); // アクションボタンの展開状態

  const onCopy = async (text, i) => {
    const ok = await safeCopyText(text);
    setCopyState({ i, ok });
    setTimeout(() => setCopyState(null), 1500);
    if (!ok) {
      // 失敗時の軽量ヒント
      console.warn("Clipboard blocked by permissions policy. Showing manual hint.");
    }
  };

  const onChatGPT = (text) => {
    const chatGPTUrl = "https://chatgpt.com/g/g-68a950f74a088191bafa2dd0a552ab4f-earthian";
    // 新しいタブでChatGPTを開く
    window.open(chatGPTUrl, '_blank');
  };

  const toggleLearned = (phraseId) => {
    const currentState = learnedPhrases[phraseId] || false;
    updateLearnedPhrases(phraseId, !currentState);
  };

  const toggleActions = (phraseId) => {
    setExpandedActions(prev => ({
      ...prev,
      [phraseId]: !prev[phraseId]
    }));
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur p-4 md:p-5 shadow-lg hover:shadow-xl transition-shadow">
      <button
        className="w-full text-left flex items-center justify-between gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <h3 className="font-semibold text-zinc-900 text-lg md:text-xl">{title}</h3>
        <span className="text-sm text-zinc-500">{open ? "−" : "+"}</span>
      </button>

      <div className="mt-3 flex flex-wrap gap-4">
        <Toggle checked={!!showEn} onChange={() => setShowEn(!showEn)} label="English" />
        <Toggle checked={!!showRo} onChange={() => setShowRo(!showRo)} label="Roman" />
      </div>

      {open && (
        <ol className="mt-4 space-y-3">
          {phrases.map((p, i) => {
            const phraseId = `${title}-${i}`;
            const isLearned = learnedPhrases[phraseId];
            
            return (
              <li key={i} className={`group rounded-xl border transition-all duration-200 p-4 ${
                isLearned 
                  ? 'border-green-200 bg-green-50/50 hover:border-green-300' 
                  : 'border-zinc-100 hover:border-indigo-200 hover:bg-indigo-50/50'
              }`}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isLearned}
                          onChange={() => toggleLearned(phraseId)}
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <div className={`font-medium leading-relaxed ${isLearned ? 'text-green-800' : 'text-zinc-900'}`}>
                          {i + 1}. {p.jp}
                        </div>
                      </div>
                    
                      {showEn && p.en && (
                        <div className="text-sm text-zinc-600 mt-0.5">{p.en}</div>
                      )}
                      {showRo && p.ro && (
                        <div className="text-xs text-zinc-500 mt-0.5">{p.ro}</div>
                      )}

                      {/* 文化的コンテキストと使用例のボタン */}
                      {(p.context || p.example) && (
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                          <div className="flex flex-wrap gap-2">
                            {p.context && (
                              <button
                                className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 px-3 py-2 rounded-lg border border-slate-200 hover:from-slate-100 hover:to-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm"
                                onClick={() => {
                                  const details = document.getElementById(`context-${phraseId}`);
                                  details.classList.toggle('hidden');
                                }}
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                詳細
                              </button>
                            )}
                            {p.example && (
                              <button
                                className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 px-3 py-2 rounded-lg border border-indigo-200 hover:from-indigo-100 hover:to-indigo-200 hover:border-indigo-300 transition-all duration-200 shadow-sm"
                                onClick={() => {
                                  const details = document.getElementById(`example-${phraseId}`);
                                  details.classList.toggle('hidden');
                                }}
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                                </svg>
                                例文
                              </button>
                            )}
                          </div>
                          
                          {/* アクショントグルボタン */}
                          <button
                            onClick={() => toggleActions(phraseId)}
                            className="inline-flex items-center justify-center w-8 h-8 text-xs bg-gradient-to-r from-zinc-50 to-zinc-100 text-zinc-600 rounded-lg border border-zinc-200 hover:from-zinc-100 hover:to-zinc-200 hover:border-zinc-300 transition-all duration-200 shadow-sm"
                          >
                            <svg className={`w-3 h-3 transition-transform duration-200 ${expandedActions[phraseId] ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* 文化的コンテキストと使用例のボタンがない場合のアクショントグルボタン */}
                      {!(p.context || p.example) && (
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={() => toggleActions(phraseId)}
                            className="inline-flex items-center justify-center w-8 h-8 text-xs bg-gradient-to-r from-zinc-50 to-zinc-100 text-zinc-600 rounded-lg border border-zinc-200 hover:from-zinc-100 hover:to-zinc-200 hover:border-zinc-300 transition-all duration-200 shadow-sm"
                          >
                            <svg className={`w-3 h-3 transition-transform duration-200 ${expandedActions[phraseId] ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* 文化的コンテキスト */}
                      {p.context && (
                        <div id={`context-${phraseId}`} className="hidden mt-2 p-2 bg-blue-50 rounded-md">
                          <div className="text-xs text-blue-800 whitespace-pre-line">{p.context}</div>
                        </div>
                      )}

                      {/* 使用例 */}
                      {p.example && (
                        <div id={`example-${phraseId}`} className="hidden mt-2 p-2 bg-purple-50 rounded-md">
                          <div className="text-xs text-purple-800 whitespace-pre-line font-mono">{p.example}</div>
                        </div>
                      )}

                      {copyState?.i === i && (
                        <div className={`mt-1 text-xs ${copyState.ok ? "text-green-600" : "text-rose-600"}`}>
                          {copyState.ok ? "コピーしました！" : "コピーがブロックされました。長押しで選択してコピーしてください。"}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* アクションボタン */}
                  {expandedActions[phraseId] && (
                    <div className="flex flex-wrap items-center gap-2 transition-all duration-200">
                      <button
                        className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 px-3 py-2 rounded-lg border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 hover:border-emerald-300 transition-all duration-200 shadow-sm"
                        onClick={() => onCopy(p.jp, i)}
                        title="コピー"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                        </svg>
                        コピー
                      </button>
                      <button
                        className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet-50 to-violet-100 text-violet-700 px-3 py-2 rounded-lg border border-violet-200 hover:from-violet-100 hover:to-violet-200 hover:border-violet-300 transition-all duration-200 shadow-sm"
                        onClick={() => onChatGPT(p.jp)}
                        title="Ask ChatGPT"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                        ChatGPT
                      </button>
                      <button
                        className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 px-3 py-2 rounded-lg border border-rose-200 hover:from-rose-100 hover:to-rose-200 hover:border-rose-300 transition-all duration-200 shadow-sm"
                        onClick={() => speak(p.jp)}
                        title="Play Audio"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-2.717a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                        再生
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function Category({ cat, query, learnedPhrases, updateLearnedPhrases }) {
  // 検索フィルタ
  const filtered = useMemo(() => {
    if (!query) return cat.sections;
    const q = String(query).toLowerCase();
    return cat.sections
      .map((s) => ({
        ...s,
        phrases: s.phrases.filter((p) =>
          [p.jp, p.en, p.ro].filter(Boolean).some((x) => String(x).toLowerCase().includes(q))
        ),
      }))
      .filter((s) => s.phrases.length > 0);
  }, [cat, query]);

  if (filtered.length === 0) return null;

  return (
    <section id={cat.id} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{cat.emoji}</div>
        <h2 className="text-xl md:text-2xl font-bold">{cat.title}</h2>
      </div>
      <div className="grid gap-4">
        {filtered.map((s) => (
          <Section 
            key={s.id} 
            title={s.title} 
            phrases={s.phrases} 
            learnedPhrases={learnedPhrases}
            updateLearnedPhrases={updateLearnedPhrases}
          />
        ))}
      </div>
    </section>
  );
}

// ======= 学習進捗表示 =======
function ProgressBar({ learnedPhrases, totalPhrases }) {
  const progress = totalPhrases > 0 ? (learnedPhrases / totalPhrases) * 100 : 0;
  
  return (
    <div className="rounded-xl border bg-white/60 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-zinc-700">Learning Progress</div>
        <div className="text-xs text-zinc-500">{learnedPhrases}/{totalPhrases}</div>
      </div>
      <div className="w-full bg-zinc-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-zinc-500 mt-1">
        {progress.toFixed(1)}% 完了
      </div>
    </div>
  );
}

// ======= 開発者向け：簡易テスト（ユーザー操作でのみ実行） =======
function DevTests() {
  const [result, setResult] = useState(null); // {name, pass}

  const runTests = async () => {
    const results = [];

    // Test 1: Clipboard API available or secure check path (may still be blocked by policy)
    try {
      const ok = await safeCopyText("TEST");
      results.push({ name: "safeCopyText basic call", pass: typeof ok === "boolean" });
    } catch (e) {
      results.push({ name: "safeCopyText basic call", pass: false });
    }

    // Test 2: Fallback path simulation by forcing failure
    const original = navigator.clipboard && navigator.clipboard.writeText;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText = async () => { throw new Error("forced"); };
      }
      const ok2 = await safeCopyText("TEST-FALLBACK");
      results.push({ name: "fallback works (forced)", pass: typeof ok2 === "boolean" });
    } catch (e) {
      results.push({ name: "fallback works (forced)", pass: false });
    } finally {
      if (navigator.clipboard && original) navigator.clipboard.writeText = original;
    }

    setResult(results);
  };

  return (
    <div className="rounded-xl border bg-white/60 p-3 text-xs text-zinc-600">
      <div className="font-semibold mb-2">開発者 • クリップボードテスト</div>
      <button className="border rounded px-2 py-1 text-xs" onClick={runTests}>テスト実行</button>
      {result && (
        <ul className="mt-2 list-disc list-inside">
          {result.map((r, i) => (
            <li key={i} className={r.pass ? "text-green-600" : "text-rose-600"}>
              {r.pass ? "成功" : "失敗"} – {r.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ======= メイン =======
export default function PhrasebookPage() {
  const [query, setQuery] = useState("");
  const [learnedPhrases, setLearnedPhrases] = useLocal(`learnedPhrases`, {});

  // 学習進捗を計算
  const totalPhrases = DATA.reduce((total, cat) => 
    total + cat.sections.reduce((sectionTotal, section) => 
      sectionTotal + section.phrases.length, 0
    ), 0
  );
  
  const learnedCount = Object.values(learnedPhrases).filter(Boolean).length;

  // 学習状態を更新する関数
  const updateLearnedPhrases = (phraseId, isLearned) => {
    setLearnedPhrases(prev => ({
      ...prev,
      [phraseId]: isLearned
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-2xl">🗂️</div>
            <div className="font-semibold text-sm sm:text-base">Practical Japanese Conversation Expressions</div>
          </div>
          <div className="w-full sm:w-1/2 sm:ml-auto">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in Japanese, English, Romaji..."
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>
      </header>

      {/* コンテンツ */}
      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6">
        {/* サイドナビ */}
        <nav className="lg:sticky lg:top-[72px] h-max space-y-4 order-2 lg:order-1">
          <div className="rounded-2xl border bg-white/70 p-3 shadow-sm">
            <div className="text-xs font-semibold text-zinc-500 mb-2">Categories</div>
            <ul className="space-y-1">
              {DATA.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-indigo-50">
                    <span className="text-lg">{c.emoji}</span>
                    <span className="text-sm">{c.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* 学習進捗 */}
          <ProgressBar learnedPhrases={learnedCount} totalPhrases={totalPhrases} />
        </nav>

        {/* 本文 */}
        <div className="space-y-10 order-1 lg:order-2">
          {DATA.map((cat) => (
            <Category 
              key={cat.id} 
              cat={cat} 
              query={query} 
              learnedPhrases={learnedPhrases}
              updateLearnedPhrases={updateLearnedPhrases}
            />
          ))}

          {/* Dev tests */}
          <DevTests />

          {/* フッターメモ */}
          <div className="text-xs text-zinc-500 pt-6">
            ※ Demo version. Expressions will be expanded gradually, and features like audio accuracy, cultural notes, and favorite saving will be added. If copying is blocked in your environment, please select text by long-press/drag and copy with Ctrl/⌘+C.
          </div>
        </div>
      </main>
    </div>
  );
} 