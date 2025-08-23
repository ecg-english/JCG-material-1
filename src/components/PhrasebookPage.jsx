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
            jp: "おまかせでお願いします。", 
            en: "I'll leave it to you.", 
            ro: "Omakase de onegaishimasu.",
            context: "店員やシェフに料理を任せる表現です。日本では「おまかせ」が高級な料理店でよく使われます。",
            example: "客：おまかせでお願いします。\n店員：かしこまりました。季節の食材を使った料理をご用意いたします。\n客：ありがとうございます。"
          },
          { 
            jp: "おすすめは何ですか？", 
            en: "What do you recommend?", 
            ro: "Osusume wa nan desu ka?",
            context: "店員におすすめを聞く定番表現です。店の特徴や季節の料理を教えてもらえることがあります。",
            example: "客：おすすめは何ですか？\n店員：当店の名物、海鮮丼はいかがでしょうか？\n客：それにします。"
          },
          { 
            jp: "先にドリンクだけお願いします。", 
            en: "Just drinks first, please.", 
            ro: "Saki ni dorinku dake onegaishimasu.",
            context: "料理の前にドリンクだけ先に注文する表現です。メニューを決める時間が欲しい時に便利です。",
            example: "客：先にドリンクだけお願いします。\n店員：かしこまりました。何になさいますか？\n客：ビールをお願いします。"
          },
          { 
            jp: "料理はまとめてお願いします。", 
            en: "Please bring all the dishes together.", 
            ro: "Ryōri wa matomete onegaishimasu.",
            context: "複数の料理を同時に出すよう依頼する表現です。家族やグループでの食事時に便利です。",
            example: "客：料理はまとめてお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "二人前ください。", 
            en: "Two portions, please.", 
            ro: "Futari mae kudasai.",
            context: "料理の分量を指定する表現です。日本では「前」が人数分を表す単位として使われます。",
            example: "客：二人前ください。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "私も同じものをください。", 
            en: "I'll have the same thing.", 
            ro: "Watashi mo onaji mono o kudasai.",
            context: "他の人が注文したものと同じものを注文する表現です。",
            example: "客：私も同じものをください。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "ご飯の大盛りは無料ですか？", 
            en: "Is the large portion of rice free?", 
            ro: "Gohan no ōmori wa muryō desu ka?",
            context: "大盛りサービスの有無を確認する表現です。多くの店で大盛りは無料で提供されます。",
            example: "客：ご飯の大盛りは無料ですか？\n店員：はい、大盛りは無料です。\n客：大盛りでお願いします。"
          },
          { 
            jp: "ハーフ＆ハーフにできますか？", 
            en: "Can you make it half and half?", 
            ro: "Hāfu & hāfu ni dekimasu ka?",
            context: "2つの料理を半分ずつ組み合わせるよう依頼する表現です。",
            example: "客：ハーフ＆ハーフにできますか？\n店員：はい、可能です。\n客：ありがとうございます。"
          },
          { 
            jp: "辛さ控えめでお願いします。", 
            en: "Please make it less spicy.", 
            ro: "Karasa hikaeme de onegaishimasu.",
            context: "辛さを調整するよう依頼する表現です。日本の料理は比較的マイルドですが、辛い料理もあります。",
            example: "客：辛さ控えめでお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "ソースは別添えでお願いします。", 
            en: "Please serve the sauce separately.", 
            ro: "Sōsu wa betsu soe de onegaishimasu.",
            context: "ソースを料理とは別に出すよう依頼する表現です。好みに応じて量を調整できます。",
            example: "客：ソースは別添えでお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "ソース多めでお願いします。", 
            en: "Please add extra sauce.", 
            ro: "Sōsu ōme de onegaishimasu.",
            context: "ソースを多めに入れるよう依頼する表現です。",
            example: "客：ソース多めでお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "チーズをトッピングでお願いします。", 
            en: "Please add cheese as a topping.", 
            ro: "Chīzu o topping de onegaishimasu.",
            context: "チーズを追加でトッピングするよう依頼する表現です。",
            example: "客：チーズをトッピングでお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "砂糖抜きでお願いします。", 
            en: "Please leave out the sugar.", 
            ro: "Satō nuki de onegaishimasu.",
            context: "砂糖を入れないよう依頼する表現です。健康やダイエットの理由で使われます。",
            example: "客：砂糖抜きでお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "温かいままでお願いします。", 
            en: "Please keep it hot.", 
            ro: "Atatakai mama de onegaishimasu.",
            context: "料理を温かい状態で出すよう依頼する表現です。",
            example: "客：温かいままでお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "期間限定メニューはありますか？", 
            en: "Do you have any limited-time menu items?", 
            ro: "Kikan gentei menyū wa arimasu ka?",
            context: "期間限定メニューの有無を確認する表現です。季節限定や特別なメニューを楽しめます。",
            example: "客：期間限定メニューはありますか？\n店員：はい、春限定の桜メニューがございます。\n客：それにします。"
          },
          { 
            jp: "すみません、メニューを見せていただけますか？", 
            en: "Excuse me, could you show me the menu?", 
            ro: "Sumimasen, menyū o misete itadakemasu ka?",
            context: "メニューを見せてもらうよう依頼する表現です。",
            example: "客：すみません、メニューを見せていただけますか？\n店員：はい、どうぞ。\n客：ありがとうございます。"
          },
          { 
            jp: "とりあえず生（ビール）お願いします。", 
            en: "I'll start with a draft beer, please.", 
            ro: "Toriaezu nama (bīru) onegaishimasu.",
            context: "最初に生ビールを注文する表現です。日本では「とりあえず生」が定番の注文です。",
            example: "客：とりあえず生（ビール）お願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "お水（お冷や）を人数分いただけますか？", 
            en: "Could we have water for everyone?", 
            ro: "Omizu (ohiya) o ninzū bun itadakemasu ka?",
            context: "人数分の水を注文する表現です。日本では「お冷や」が水を表す丁寧な表現です。",
            example: "客：お水（お冷や）を人数分いただけますか？\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "お水（お冷や）、おかわりいただけますか？", 
            en: "Could I get a refill of water?", 
            ro: "Omizu (ohiya), okawari itadakemasu ka?",
            context: "水のおかわりを依頼する表現です。",
            example: "客：お水（お冷や）、おかわりいただけますか？\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "子ども用メニューはありますか？", 
            en: "Do you have a children's menu?", 
            ro: "Kodomo yō menyū wa arimasu ka?",
            context: "子ども用メニューの有無を確認する表現です。",
            example: "客：子ども用メニューはありますか？\n店員：はい、ございます。\n客：ありがとうございます。"
          },
          { 
            jp: "急ぎでお願いします。", 
            en: "Please hurry.", 
            ro: "Isogi de onegaishimasu.",
            context: "料理を急いで出すよう依頼する表現です。時間がない時に使います。",
            example: "客：急ぎでお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "取り分け用に小皿をお願いできますか？", 
            en: "Could we have small plates for sharing?", 
            ro: "Toriwake yō ni kozara o onegai dekimasu ka?",
            context: "料理を分け合うための小皿を依頼する表現です。",
            example: "客：取り分け用に小皿をお願いできますか？\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "飲み放題でお願いします。", 
            en: "All-you-can-drink, please.", 
            ro: "Nomihōdai de onegaishimasu.",
            context: "飲み放題プランを選択する表現です。日本では「飲み放題」が人気のサービスです。",
            example: "客：飲み放題でお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
        ],
      },
      {
        id: "reactions",
        title: "3. Mealtime Reactions",
        phrases: [
          { 
            jp: "ナイフとフォークはありますか？", 
            en: "Do you have knives and forks?", 
            ro: "Naifu to fōku wa arimasu ka?",
            context: "洋食を食べる際に必要な食器を確認する表現です。日本では箸が主流ですが、洋食ではナイフとフォークも使用します。",
            example: "客：ナイフとフォークはありますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "どのタレがおすすめですか？", 
            en: "Which sauce do you recommend?", 
            ro: "Dono tare ga osusume desu ka?",
            context: "複数のソースがある場合におすすめを聞く表現です。",
            example: "客：どのタレがおすすめですか？\n店員：当店の特製タレがおすすめです。\n客：それをお願いします。"
          },
          { 
            jp: "美味しいですね！ / うまい！", 
            en: "This is delicious! / Yummy!", 
            ro: "Oishii desu ne! / Umai!",
            context: "料理に対する率直な感想を伝える表現です。「うまい」はカジュアルな表現です。",
            example: "客：美味しいですね！\n店員：ありがとうございます。\n客：また来ます！"
          },
          { 
            jp: "塩を取ってください", 
            en: "Please pass the salt.", 
            ro: "Shio o totte kudasai.",
            context: "テーブルにある塩を取ってもらうよう依頼する表現です。",
            example: "あなた：塩を取ってください。\n友人：はい、どうぞ。\nあなた：ありがとうございます。"
          },
          { 
            jp: "猫舌なんですよね", 
            en: "I can't eat hot food.", 
            ro: "Nekojita nan desu yo ne.",
            context: "熱いものが苦手であることを伝える表現です。日本では「猫舌」という表現がよく使われます。",
            example: "客：猫舌なんですよね。\n店員：かしこまりました。少し冷ましてからお出しします。\n客：ありがとうございます。"
          },
          { 
            jp: "甘党ですか？（誤用）", 
            en: "Do you like sweet things? (incorrect usage)", 
            ro: "Amatō desu ka?",
            context: "本来、お酒（辛いもの）を好む人である「辛党（からとう）」の対義語として、お酒よりも甘い菓子類を好む人を指す言葉です。現代では甘いものが好きな人を指して使われることが一般的です。",
            example: "友人：甘党ですか？\nあなた：はい、甘いものが好きです。"
          },
          { 
            jp: "いただきます。", 
            en: "Thank you for the meal.", 
            ro: "Itadakimasu.",
            context: "食事を始める際の挨拶です。日本では食事の前に必ず言う習慣があります。",
            example: "客：いただきます。\n店員：どうぞ、お召し上がりください。\n客：ありがとうございます。"
          },
          { 
            jp: "思ったよりボリュームありますね。", 
            en: "It's more filling than I expected.", 
            ro: "Omotta yori boryūmu arimasu ne.",
            context: "料理の量についての感想を伝える表現です。",
            example: "客：思ったよりボリュームありますね。\n店員：はい、お腹いっぱいになっていただけると思います。\n客：ありがとうございます。"
          },
          { 
            jp: "この辛さ、ちょうどいいです。", 
            en: "This spiciness is just right.", 
            ro: "Kono karasa, chōdo ii desu.",
            context: "辛さの加減が適切であることを伝える表現です。",
            example: "客：この辛さ、ちょうどいいです。\n店員：ありがとうございます。\n客：とても美味しいです。"
          },
          { 
            jp: "思ったよりさっぱりしてますね。", 
            en: "It's lighter than I expected.", 
            ro: "Omotta yori sappari shite masu ne.",
            context: "料理が予想より軽い味であることを伝える表現です。",
            example: "客：思ったよりさっぱりしてますね。\n店員：はい、さっぱりとした味付けになっております。\n客：とても美味しいです。"
          },
          { 
            jp: "このソース、何が入ってますか？", 
            en: "What's in this sauce?", 
            ro: "Kono sōsu, nani ga haitte masu ka?",
            context: "ソースの材料を確認する表現です。アレルギーがある場合に重要です。",
            example: "客：このソース、何が入ってますか？\n店員：醤油、みりん、砂糖が入っております。\n客：ありがとうございます。"
          },
          { 
            jp: "レモンをもう少しいただけますか？", 
            en: "Could I have a bit more lemon?", 
            ro: "Remon o mō sukoshi itadakemasu ka?",
            context: "レモンを追加で依頼する表現です。",
            example: "客：レモンをもう少しいただけますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "パン（またはライス）、おかわりできますか？", 
            en: "Can I get a refill of bread (or rice)?", 
            ro: "Pan (matawa raisu), okawari dekimasu ka?",
            context: "パンやご飯のおかわりを依頼する表現です。",
            example: "客：パン、おかわりできますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "すごく香ばしいですね。", 
            en: "It's very aromatic.", 
            ro: "Sugoku kōbashii desu ne.",
            context: "料理の香りが良いことを伝える表現です。",
            example: "客：すごく香ばしいですね。\n店員：ありがとうございます。\n客：とても美味しいです。"
          },
          { 
            jp: "皮がパリッとしてていい食感です。", 
            en: "The skin is crispy and has a nice texture.", 
            ro: "Kawa ga paritto shite te ii shokkan desu.",
            context: "料理の食感についての感想を伝える表現です。",
            example: "客：皮がパリッとしてていい食感です。\n店員：ありがとうございます。\n客：とても美味しいです。"
          },
          { 
            jp: "出汁がしっかりきいてますね。", 
            en: "The broth has a rich flavor.", 
            ro: "Dashi ga shikkari kiite masu ne.",
            context: "出汁の味がしっかりと効いていることを伝える表現です。",
            example: "客：出汁がしっかりきいてますね。\n店員：ありがとうございます。\n客：とても美味しいです。"
          },
          { 
            jp: "これ、どうやって食べるのが正解ですか？", 
            en: "What's the correct way to eat this?", 
            ro: "Kore, dō yatte taberu no ga seikai desu ka?",
            context: "料理の正しい食べ方を確認する表現です。",
            example: "客：これ、どうやって食べるのが正解ですか？\n店員：箸で一口ずつお召し上がりください。\n客：ありがとうございます。"
          },
          { 
            jp: "ちょっとレアめですね。（肉料理など）", 
            en: "It's a bit rare. (for meat dishes)", 
            ro: "Chotto rea me desu ne. (nikuryōri nado)",
            context: "肉料理の焼き加減についての感想を伝える表現です。",
            example: "客：ちょっとレアめですね。\n店員：申し訳ございません。もう少し焼き直しましょうか？\n客：いえ、このままで大丈夫です。"
          },
          { 
            jp: "後から辛さがきますね。", 
            en: "The spiciness hits you later.", 
            ro: "Ato kara karasa ga kimasu ne.",
            context: "辛さが後から感じられることを伝える表現です。",
            example: "客：後から辛さがきますね。\n店員：はい、じわじわと辛さが広がる味付けになっております。\n客：とても美味しいです。"
          },
          { 
            jp: "ビール、よく冷えてますね。", 
            en: "The beer is nicely chilled.", 
            ro: "Bīru, yoku hiete masu ne.",
            context: "ビールの温度が適切であることを伝える表現です。",
            example: "客：ビール、よく冷えてますね。\n店員：ありがとうございます。\n客：とても美味しいです。"
          },
          { 
            jp: "香りがいいですね。", 
            en: "It smells good.", 
            ro: "Kaori ga ii desu ne.",
            context: "料理の香りが良いことを伝える表現です。",
            example: "客：香りがいいですね。\n店員：ありがとうございます。\n客：とても美味しいです。"
          },
          { 
            jp: "この量、ちょうどいいです。", 
            en: "This amount is just right.", 
            ro: "Kono ryō, chōdo ii desu.",
            context: "料理の量が適切であることを伝える表現です。",
            example: "客：この量、ちょうどいいです。\n店員：ありがとうございます。\n客：とても美味しいです。"
          },
          { 
            jp: "このメニュー、季節限定なんですね。", 
            en: "This menu item is seasonal, isn't it?", 
            ro: "Kono menyū, kisetsu gentei nan desu ne.",
            context: "季節限定メニューであることを確認する表現です。",
            example: "客：このメニュー、季節限定なんですね。\n店員：はい、春限定の桜メニューです。\n客：とても美味しいです。"
          },
          { 
            jp: "箸置きはありますか？", 
            en: "Do you have chopstick rests?", 
            ro: "Hashioki wa arimasu ka?",
            context: "箸置きの有無を確認する表現です。",
            example: "客：箸置きはありますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "ごちそうさま、まだ温かいうちに食べ進めます。", 
            en: "Thank you for the meal, I'll continue eating while it's still warm.", 
            ro: "Gochisōsama, mada atatakai uchi ni tabe susume masu.",
            context: "食事を終える際の挨拶です。日本では「ごちそうさま」が定番です。",
            example: "客：ごちそうさま、まだ温かいうちに食べ進めます。\n店員：ありがとうございました。\n客：とても美味しかったです。"
          },
        ],
      },
      {
        id: "problems",
        title: "4. Problems & Requests",
        phrases: [
          { 
            jp: "すみません、注文した◯◯がまだ来ていないようです。", 
            en: "Excuse me, the ____ I ordered hasn't arrived yet.", 
            ro: "Sumimasen, chūmon shita ____ ga mada kite inai yō desu.",
            context: "注文した料理が遅い場合の丁寧な伝え方です。感情的にならず、事実を伝えることで適切に対応してもらえます。",
            example: "客：すみません、注文したパスタがまだ来ていないようです。\n店員：申し訳ございません。確認いたします。\n客：ありがとうございます。"
          },
          { 
            jp: "こちら、注文と違うようです。（◯◯ではなく◯◯が来ました）", 
            en: "This seems different from what I ordered. (I got ____ instead of ____)", 
            ro: "Kochira, chūmon to chigau yō desu. (____ dewa naku ____ ga kimashita)",
            context: "注文と異なる料理が来た場合の丁寧な伝え方です。",
            example: "客：こちら、注文と違うようです。パスタではなくラーメンが来ました。\n店員：申し訳ございません。すぐに取り替えいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "すみません、ひとつ変更しても大丈夫ですか？", 
            en: "Excuse me, is it okay to change one item?", 
            ro: "Sumimasen, hitotsu henkō shite mo daijōbu desu ka?",
            context: "注文を変更したい場合の丁寧な依頼表現です。",
            example: "客：すみません、ひとつ変更しても大丈夫ですか？\n店員：はい、承知いたしました。\n客：ありがとうございます。"
          },
          { 
            jp: "料理、少し遅らせて出していただけますか？", 
            en: "Could you serve the dishes a bit later?", 
            ro: "Ryōri, sukoshi okurasete dashite itadakemasu ka?",
            context: "料理の出し方を調整してもらうよう依頼する表現です。",
            example: "客：料理、少し遅らせて出していただけますか？\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "ぬるいようなので、温め直していただけますか？", 
            en: "It seems lukewarm, could you heat it up again?", 
            ro: "Nurui yō na no de, atatame naoshite itadakemasu ka?",
            context: "料理がぬるい場合に温め直してもらうよう依頼する表現です。",
            example: "客：ぬるいようなので、温め直していただけますか？\n店員：申し訳ございません。すぐに温め直いたします。\n客：ありがとうございます。"
          },
          { 
            jp: "フォーク（スプーン）をもう一本いただけますか？", 
            en: "Could I have another fork (spoon)?", 
            ro: "Fōku (supūn) o mō ippon itadakemasu ka?",
            context: "追加の食器を依頼する表現です。",
            example: "客：フォークをもう一本いただけますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "箸を落としてしまいました。新しいものをいただけますか？", 
            en: "I dropped my chopsticks. Could I have a new pair?", 
            ro: "Hashi o otoshite shimaimashita. Atarashii mono o itadakemasu ka?",
            context: "箸を落としてしまった場合に新しいものを依頼する表現です。",
            example: "客：箸を落としてしまいました。新しいものをいただけますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "ナプキン（おしぼり）をもう一ついただけますか？", 
            en: "Could I have another napkin (wet towel)?", 
            ro: "Napukin (oshibori) o mō hitotsu itadakemasu ka?",
            context: "ナプキンやおしぼりを追加で依頼する表現です。",
            example: "客：ナプキンをもう一ついただけますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "ストローをいただけますか？", 
            en: "Could I have a straw?", 
            ro: "Sutorō o itadakemasu ka?",
            context: "ストローを依頼する表現です。",
            example: "客：ストローをいただけますか？\n店員：はい、お持ちいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "氷を少なめ（または抜き）にできますか？", 
            en: "Could you make it with less ice (or no ice)?", 
            ro: "Kōri o sukuname (matawa nuki) ni dekimasu ka?",
            context: "氷の量を調整してもらうよう依頼する表現です。",
            example: "客：氷を少なめにできますか？\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "アレルギーがあるので、ナッツ抜きにできますか？", 
            en: "I have an allergy, could you leave out the nuts?", 
            ro: "Arerugī ga aru no de, nattsu nuki ni dekimasu ka?",
            context: "アレルギーがある場合の重要な表現です。命に関わることもあるので、しっかりと伝えることが大切です。",
            example: "客：アレルギーがあるので、ナッツ抜きにできますか？\n店員：承知いたしました。ナッツは使用いたしません。\n客：ありがとうございます。"
          },
          { 
            jp: "できれば香菜（パクチー）抜きでお願いします。", 
            en: "If possible, please leave out the cilantro (coriander).", 
            ro: "Dekireba kōsai (pakuchī) nuki de onegaishimasu.",
            context: "香菜が苦手な場合に抜いてもらうよう依頼する表現です。",
            example: "客：できれば香菜抜きでお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "量を少なめにしていただけますか？", 
            en: "Could you make it a smaller portion?", 
            ro: "Ryō o sukuname ni shite itadakemasu ka?",
            context: "料理の量を少なくしてもらうよう依頼する表現です。",
            example: "客：量を少なめにしていただけますか？\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "もう少し火を通していただけますか？（焼き加減）", 
            en: "Could you cook it a bit more? (doneness)", 
            ro: "Mō sukoshi hi o tōshite itadakemasu ka? (yakigagen)",
            context: "料理の焼き加減を調整してもらうよう依頼する表現です。",
            example: "客：もう少し火を通していただけますか？\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "グラスにヒビがあるようです。交換していただけますか？", 
            en: "There seems to be a crack in the glass. Could you replace it?", 
            ro: "Gurasu ni hibi ga aru yō desu. Kōkan shite itadakemasu ka?",
            context: "グラスにヒビがある場合に交換してもらうよう依頼する表現です。",
            example: "客：グラスにヒビがあるようです。交換していただけますか？\n店員：申し訳ございません。すぐに取り替えいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "すみません、髪の毛が入っているようです。取り替えていただけますか？", 
            en: "Excuse me, there seems to be a hair in it. Could you replace it?", 
            ro: "Sumimasen, kaminoke ga haitte iru yō desu. Torikaete itadakemasu ka?",
            context: "料理に髪の毛が入っている場合に取り替えてもらうよう依頼する表現です。",
            example: "客：すみません、髪の毛が入っているようです。取り替えていただけますか？\n店員：申し訳ございません。すぐに取り替えいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "テーブルを拭いていただけますか？", 
            en: "Could you wipe the table?", 
            ro: "Tēburu o fuite itadakemasu ka?",
            context: "テーブルを拭いてもらうよう依頼する表現です。",
            example: "客：テーブルを拭いていただけますか？\n店員：はい、すぐに拭かせていただきます。\n客：ありがとうございます。"
          },
          { 
            jp: "もう少し静かな席に移れますか？", 
            en: "Could we move to a quieter table?", 
            ro: "Mō sukoshi shizuka na seki ni utsuremasu ka?",
            context: "静かな席に移動したい場合の依頼表現です。",
            example: "客：もう少し静かな席に移れますか？\n店員：はい、奥の席にご案内いたします。\n客：ありがとうございます。"
          },
          { 
            jp: "子ども用の椅子はありますか？", 
            en: "Do you have children's chairs?", 
            ro: "Kodomo yō no isu wa arimasu ka?",
            context: "子ども用の椅子の有無を確認する表現です。",
            example: "客：子ども用の椅子はありますか？\n店員：はい、ございます。\n客：ありがとうございます。"
          },
          { 
            jp: "ベビーカーを置ける場所はありますか？", 
            en: "Is there a place to put the stroller?", 
            ro: "Bebīkā o okeru basho wa arimasu ka?",
            context: "ベビーカーを置く場所の有無を確認する表現です。",
            example: "客：ベビーカーを置ける場所はありますか？\n店員：はい、入口付近に置いていただけます。\n客：ありがとうございます。"
          },
          { 
            jp: "充電しても大丈夫でしょうか？（コンセントは使えますか？）", 
            en: "Is it okay to charge? (Can I use the outlet?)", 
            ro: "Jūden shite mo daijōbu deshō ka? (Konsento wa tsukaemasu ka?)",
            context: "充電してもよいか確認する表現です。",
            example: "客：充電しても大丈夫でしょうか？\n店員：はい、お気軽にどうぞ。\n客：ありがとうございます。"
          },
          { 
            jp: "お水は常温でお願いできますか？", 
            en: "Could I have water at room temperature?", 
            ro: "Omizu wa jōon de onegai dekimasu ka?",
            context: "水を常温で出してもらうよう依頼する表現です。",
            example: "客：お水は常温でお願いできますか？\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "シェアするので、取り分け用にスプーン／フォークを追加でお願いします。", 
            en: "We're sharing, so could we have extra spoons/forks for serving?", 
            ro: "Shea suru no de, toriwake yō ni supūn/fōku o tsuika de onegaishimasu.",
            context: "料理を分け合うための食器を追加で依頼する表現です。",
            example: "客：シェアするので、取り分け用にスプーンを追加でお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "先ほどの注文、まだでしたら一点キャンセルできますか？", 
            en: "If it's not too late, could I cancel one item from my previous order?", 
            ro: "Saki hodo no chūmon, mada deshitara itten kyanseru dekimasu ka?",
            context: "先ほどの注文をキャンセルしたい場合の依頼表現です。",
            example: "客：先ほどの注文、まだでしたら一点キャンセルできますか？\n店員：はい、承知いたしました。\n客：ありがとうございます。"
          },
        ],
      },
      {
        id: "paying",
        title: "5. Paying the Bill",
        phrases: [
          { 
            jp: "お会計お願いします。", 
            en: "Check, please.", 
            ro: "Okaikei onegaishimasu.",
            context: "日本では手を上げて店員を呼ぶのは失礼とされています。この表現で静かに声をかけるのがマナーです。",
            example: "客：お会計お願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "こちらでお支払いですか？（テーブル会計ですか？）", 
            en: "Will you pay here? (Table payment?)", 
            ro: "Kochira de oshiharai desu ka? (Tēburu kaikei desu ka?)",
            context: "店員が客に支払い方法を確認する表現です。テーブル会計かレジ会計かを確認します。",
            example: "店員：こちらでお支払いですか？\n客：はい、お願いします。\n店員：かしこまりました。"
          },
          { 
            jp: "まとめてお願いします。", 
            en: "All together, please.", 
            ro: "Matomete onegaishimasu.",
            context: "複数人での食事時に一人が全員分を支払う場合の表現です。",
            example: "あなた：まとめてお願いします。\n友人：ありがとう！\nあなた：どういたしまして。"
          },
          { 
            jp: "別々でお願いします。", 
            en: "Separately, please.", 
            ro: "Betsubetsu de onegaishimasu.",
            context: "複数人での食事時に各自が支払う場合の表現です。日本では割り勘が一般的です。",
            example: "あなた：別々でお願いします。\n友人：はい、そうしましょう。\nあなた：ありがとうございます。"
          },
          { 
            jp: "現金で払います。", 
            en: "I'll pay in cash.", 
            ro: "Genkin de haraimasu.",
            context: "現金で支払うことを伝える表現です。",
            example: "客：現金で払います。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "カード使えますか？", 
            en: "Can I use a card?", 
            ro: "Kādo tsukaemasu ka?",
            context: "カード決済の可否を確認する表現です。日本では現金が主流ですが、最近はカード決済も普及しています。",
            example: "客：カード使えますか？\n店員：はい、クレジットカードをお使いいただけます。\n客：ありがとうございます。"
          },
          { 
            jp: "タッチ決済は使えますか？", 
            en: "Can I use touch payment?", 
            ro: "Tatchi kessai wa tsukaemasu ka?",
            context: "タッチ決済の可否を確認する表現です。",
            example: "客：タッチ決済は使えますか？\n店員：はい、Apple PayやGoogle Payがご利用いただけます。\n客：ありがとうございます。"
          },
          { 
            jp: "交通系IC（Suicaなど）は使えますか？", 
            en: "Can I use transportation IC cards (like Suica)?", 
            ro: "Kōtsūkei IC (Suica nado) wa tsukaemasu ka?",
            context: "交通系ICカードでの決済可否を確認する表現です。",
            example: "客：交通系IC（Suicaなど）は使えますか？\n店員：はい、SuicaやPASMOがご利用いただけます。\n客：ありがとうございます。"
          },
          { 
            jp: "PayPayは使えますか？", 
            en: "Can I use PayPay?", 
            ro: "PayPay wa tsukaemasu ka?",
            context: "PayPayでの決済可否を確認する表現です。",
            example: "客：PayPayは使えますか？\n店員：はい、PayPayがご利用いただけます。\n客：ありがとうございます。"
          },
          { 
            jp: "レシートください。", 
            en: "Receipt, please.", 
            ro: "Reshīto kudasai.",
            context: "レシートを依頼する表現です。経費精算や記録のために必要です。",
            example: "客：レシートください。\n店員：はい、お渡しいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "領収書をお願いします。宛名は◯◯で。", 
            en: "A receipt, please. Make it out to ____.", 
            ro: "Ryōshūsho o onegaishimasu. Ate na wa ____ de.",
            context: "領収書を依頼する際に宛名を指定する表現です。",
            example: "客：領収書をお願いします。宛名は田中で。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "但し書きは「飲食代」でお願いします。", 
            en: "Please write 'Food and beverage expenses' in the description.", 
            ro: "Tadashigaki wa 'inshokudai' de onegaishimasu.",
            context: "領収書の但し書きを指定する表現です。経費精算の際に重要です。",
            example: "客：但し書きは「飲食代」でお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "クーポン使えますか？", 
            en: "Can I use a coupon?", 
            ro: "Kūpon tsukaemasu ka?",
            context: "クーポンの使用可否を確認する表現です。",
            example: "客：クーポン使えますか？\n店員：はい、ご利用いただけます。\n客：ありがとうございます。"
          },
          { 
            jp: "ポイント付けてもらえますか？", 
            en: "Can I earn points?", 
            ro: "Pointo tsukete moraemasu ka?",
            context: "ポイントカードの使用可否を確認する表現です。",
            example: "客：ポイント付けてもらえますか？\n店員：はい、ポイントカードをお持ちでしたらお付けいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "これは税込みですか？税別ですか？", 
            en: "Is this including tax or excluding tax?", 
            ro: "Kore wa zeikomi desu ka? Zeibetsu desu ka?",
            context: "税込み価格か税別価格かを確認する表現です。",
            example: "客：これは税込みですか？税別ですか？\n店員：税込み価格となっております。\n客：ありがとうございます。"
          },
          { 
            jp: "サービス料は含まれていますか？", 
            en: "Is the service charge included?", 
            ro: "Sābisu ryō wa fukumarete imasu ka?",
            context: "サービス料の有無を確認する表現です。",
            example: "客：サービス料は含まれていますか？\n店員：はい、サービス料は含まれております。\n客：ありがとうございます。"
          },
          { 
            jp: "現金とカードで分けても大丈夫ですか？", 
            en: "Is it okay to split between cash and card?", 
            ro: "Genkin to kādo de wakete mo daijōbu desu ka?",
            context: "現金とカードで分けて支払うことを確認する表現です。",
            example: "客：現金とカードで分けても大丈夫ですか？\n店員：はい、可能です。\n客：ありがとうございます。"
          },
          { 
            jp: "◯◯円からお願いします。（現金）", 
            en: "From ____ yen, please. (cash)", 
            ro: "____ en kara onegaishimasu. (genkin)",
            context: "現金で支払う際に、お釣りを計算しやすくするための表現です。",
            example: "客：1000円からお願いします。\n店員：かしこまりました。\n客：ありがとうございます。"
          },
          { 
            jp: "お釣りは要りません。", 
            en: "Keep the change.", 
            ro: "Otsuri wa irimasen.",
            context: "お釣りをチップとして渡す表現です。日本ではチップの習慣はありませんが、この表現で伝わります。",
            example: "客：お釣りは要りません。\n店員：ありがとうございます。\n客：どういたしまして。"
          },
          { 
            jp: "領収書、電子でもらえますか？", 
            en: "Can I get an electronic receipt?", 
            ro: "Ryōshūsho, denshi de moraemasu ka?",
            context: "電子領収書の可否を確認する表現です。",
            example: "客：領収書、電子でもらえますか？\n店員：はい、メールでお送りいたします。\n客：ありがとうございます。"
          },
          { 
            jp: "サインはこちらでいいですか？", 
            en: "Should I sign here?", 
            ro: "Sain wa kochira de ii desu ka?",
            context: "カード決済時のサイン位置を確認する表現です。",
            example: "客：サインはこちらでいいですか？\n店員：はい、その通りです。\n客：ありがとうございます。"
          },
          { 
            jp: "QRコードはどちらで読み取ればいいですか？", 
            en: "Where should I scan the QR code?", 
            ro: "QR kōdo wa dochira de yomitoreba ii desu ka?",
            context: "QRコード決済時の読み取り位置を確認する表現です。",
            example: "客：QRコードはどちらで読み取ればいいですか？\n店員：こちらの端末でお読み取りください。\n客：ありがとうございます。"
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
  const [open, setOpen] = useState(false);
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
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* 上部セクション（Categories & Learning Progress） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories */}
          <div className="rounded-2xl border bg-white/70 p-4 shadow-sm">
            <div className="text-sm font-semibold text-zinc-700 mb-3">Categories</div>
            <div className="grid grid-cols-1 gap-2">
              {DATA.map((c) => (
                <a 
                  key={c.id} 
                  href={`#${c.id}`} 
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-indigo-50 transition-colors"
                >
                  <span className="text-lg flex-shrink-0">{c.emoji}</span>
                  <span className="text-sm font-medium truncate">{c.title}</span>
                </a>
              ))}
            </div>
          </div>
          
          {/* 学習進捗 */}
          <div className="rounded-2xl border bg-white/70 p-4 shadow-sm">
            <ProgressBar learnedPhrases={learnedCount} totalPhrases={totalPhrases} />
          </div>
        </div>

        {/* 本文 */}
        <div className="space-y-10">
          {DATA.map((cat) => (
            <Category 
              key={cat.id} 
              cat={cat} 
              query={query} 
              learnedPhrases={learnedPhrases}
              updateLearnedPhrases={updateLearnedPhrases}
            />
          ))}


        </div>
      </main>
    </div>
  );
} 