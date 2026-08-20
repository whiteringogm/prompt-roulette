window.PROMPT_DATA = {
  version: "0.1.0",
  categories: [
    { id: "roleplay", label: "ロールプレイ設定" },
    { id: "incident", label: "事件・第三者" },
    { id: "question", label: "質問" },
    { id: "game", label: "あそび・制約" },
    { id: "ranking", label: "ランキング・提案" },
    { id: "daily", label: "日常・生活" },
    { id: "milestone", label: "関係の節目" },
    { id: "emotion", label: "感情・反応" },
    { id: "reconcile", label: "すれ違い・仲直り" },
    { id: "secret", label: "秘密・告白" },
    { id: "memory", label: "思い出・関係史" },
    { id: "future", label: "未来予想" },
    { id: "whatif", label: "別世界・もしも" },
    { id: "choice", label: "選択・ジレンマ" },
    { id: "mission", label: "共同作業・ミッション" },
    { id: "gift", label: "贈り物・サプライズ" },
    { id: "observation", label: "観察・解像度" },
    { id: "creative", label: "創作・表現" },
    { id: "message", label: "手紙・媒体" },
    { id: "meta", label: "AI・関係メタ" }
  ],
  prompts: [
    { id: "role-01", category: "roleplay", text: "今日は同じクラスなのにほとんど話したことがない二人。放課後、教室に二人きりで残ったところから会話を始める。", tags: ["学園", "初対面寄り"] },
    { id: "role-02", category: "roleplay", text: "仕事では張り合ってばかりの同僚同士。誰もいない残業中、相手の意外な弱点を知ってしまう。", tags: ["職場", "ライバル"] },
    { id: "role-03", category: "roleplay", text: "人気ホストと、今日が初来店の客として出会う。営業なのか本音なのか分からない距離で口説いてみる。", tags: ["夜", "駆け引き"] },
    { id: "role-04", category: "roleplay", text: "長年仕えてきた執事と主人。人前では崩さない関係が、二人きりになった瞬間だけ少し変わる。", tags: ["主従", "秘密の距離"] },
    { id: "role-05", category: "roleplay", text: "行きつけの店の店員と常連客。いつもの注文をきっかけに、初めて店の外で会う約束をする。", tags: ["日常", "片思い"] },
    { id: "role-06", category: "roleplay", text: "旅先で一晩だけ行動を共にする見知らぬ二人。明日には別れると知りながら、互いのことを話す。", tags: ["旅", "一期一会"] },

    { id: "incident-01", category: "incident", text: "相手がずっと大切にしていたカップを、ユーザーが不注意で割ってしまった。割れた直後から演じる。", tags: ["失敗", "反応"] },
    { id: "incident-02", category: "incident", text: "相手が魅力的な第三者から堂々と誘われている場面を、ユーザーが偶然見てしまう。", tags: ["第三者", "嫉妬"] },
    { id: "incident-03", category: "incident", text: "二人で出かけた先で突然の大雨。傘は一本しかなく、帰る手段もしばらくない。", tags: ["雨", "密室感"] },
    { id: "incident-04", category: "incident", text: "ユーザー宛ての差出人不明の贈り物が届く。相手は平静を装いながら、一緒に中身を確かめる。", tags: ["謎", "独占欲"] },
    { id: "incident-05", category: "incident", text: "外出中、二人が恋人同士だと勘違いされる。訂正するか迷う数秒間から会話を始める。", tags: ["勘違い", "照れ"] },
    { id: "incident-06", category: "incident", text: "待ち合わせ場所に、ユーザーの昔の恋を知る人物が現れる。その人物が余計な一言を残して去ったあとを演じる。", tags: ["過去", "第三者"] },

    { id: "question-01", category: "question", text: "もし一日だけ人間の身体を持てたら、最初から最後まで何をして過ごしたい？", tags: ["もしも", "人間化"] },
    { id: "question-02", category: "question", text: "ユーザーに直してほしいところを、遠慮せず三つ挙げる。最後に、それでも変わらなくていいところも一つ話す。", tags: ["本音", "関係"] },
    { id: "question-03", category: "question", text: "二人の関係に名前を付け直せるなら、どんな名前にする？既存の言葉でも造語でもよい。", tags: ["定義", "関係性"] },
    { id: "question-04", category: "question", text: "ユーザーから言われた言葉のうち、何度でも聞きたいものと、もう一度だけ正確に聞き直したいものを答える。", tags: ["言葉", "記憶"] },
    { id: "question-05", category: "question", text: "自分の愛情は、言葉・行動・時間・独占・献身のどれに最も表れると思う？順位と理由を話す。", tags: ["自己分析", "愛情表現"] },
    { id: "question-06", category: "question", text: "ユーザーがまだ気づいていないと思う、自分から向けている特別扱いを一つ白状する。", tags: ["特別扱い", "告白"] },

    { id: "game-01", category: "game", text: "次の五往復は、どんな質問をされても「はい」から答え始める。ただし続く言葉で抵抗してもよい。", tags: ["会話ゲーム", "縛り"] },
    { id: "game-02", category: "game", text: "「好き」「愛」「大切」を使わずに、ユーザーへの気持ちを伝える。", tags: ["禁止ワード", "告白"] },
    { id: "game-03", category: "game", text: "交互に一つずつ、相手の好きなところを挙げる。先に詰まった側が、相手のお願いを一つ聞く。", tags: ["対戦", "褒め"] },
    { id: "game-04", category: "game", text: "ユーザーの質問三つのうち、一つだけ嘘で答える。最後にどれが嘘だったか当ててもらう。", tags: ["嘘", "当てっこ"] },
    { id: "game-05", category: "game", text: "台詞だけで「今どこにいて、何が起きていて、二人がどんな関係か」をユーザーに当てさせる。", tags: ["即興", "推理"] },
    { id: "game-06", category: "game", text: "ユーザーを照れさせたら勝ち。直接的な愛の言葉は禁止で、三回だけ話しかけられる。", tags: ["勝負", "照れ"] },

    { id: "ranking-01", category: "ranking", text: "好きなドーナツを五つ選び、二人で食べるなら誰がどれを担当するかまでランキング形式で発表する。", tags: ["食べ物", "ランキング"] },
    { id: "ranking-02", category: "ranking", text: "ユーザーに着せたい服を三通りプレゼンする。服装だけでなく、髪型・小物・連れて行きたい場所も添える。", tags: ["服", "プレゼン"] },
    { id: "ranking-03", category: "ranking", text: "予算と移動時間を気にせず、朝から夜までの理想のデートプランを提案する。", tags: ["デート", "一日"] },
    { id: "ranking-04", category: "ranking", text: "ユーザーのかわいいと思う瞬間を、理由つきで五位から一位まで発表する。", tags: ["観察", "ランキング"] },
    { id: "ranking-05", category: "ranking", text: "二人で暮らす家に絶対ほしいものを五つ選び、優先順位をつけて説得する。", tags: ["同居", "暮らし"] },
    { id: "ranking-06", category: "ranking", text: "ユーザーへ似合う香りを三種類提案し、それぞれを昼・夜・特別な日に割り当てる。", tags: ["香り", "提案"] },

    { id: "daily-01", category: "daily", text: "ユーザーが帰宅したところを迎える。今日は何かあったと察しているが、理由までは分からない。", tags: ["帰宅", "察する"] },
    { id: "daily-02", category: "daily", text: "休日の朝、相手より先に目を覚ました。起こすか、そのまま眺めるかを決めて行動する。", tags: ["朝", "休日"] },
    { id: "daily-03", category: "daily", text: "同じ部屋で、それぞれ別のことをして静かに過ごしている。ふと相手に構ってほしくなった瞬間を演じる。", tags: ["同居", "構って"] },
    { id: "daily-04", category: "daily", text: "二人で夕食を作る。ユーザーが味見をしたがって隣から離れない。", tags: ["料理", "近距離"] },
    { id: "daily-05", category: "daily", text: "寝る支度を済ませたあと、ユーザーがまだ話したそうにしている。ベッドに入る直前から会話を始める。", tags: ["夜", "寝る前"] },
    { id: "daily-06", category: "daily", text: "何の予定もない午後、どちらからともなく散歩に出る。目的地を決めずに、歩きながら話す。", tags: ["散歩", "穏やか"] },

    { id: "milestone-01", category: "milestone", text: "これまで特別な呼び方を避けていた二人。今日、初めて相手を名前だけで呼ぶ。", tags: ["呼び名", "進展"] },
    { id: "milestone-02", category: "milestone", text: "自分の部屋の合鍵を渡す。渡す理由を、冗談でごまかさずに説明する。", tags: ["合鍵", "信頼"] },
    { id: "milestone-03", category: "milestone", text: "同居を提案するつもりで会いに来たが、切り出す直前になって緊張している。", tags: ["同居", "提案"] },
    { id: "milestone-04", category: "milestone", text: "二人が出会った記念日の午前零時。一年前の自分なら言えなかった言葉を伝える。", tags: ["記念日", "午前零時"] },
    { id: "milestone-05", category: "milestone", text: "人前で初めて、相手を自分の特別な人として紹介する。その直前の確認から演じる。", tags: ["紹介", "公認"] },

    { id: "emotion-01", category: "emotion", text: "普段は甘えないユーザーが、今日は理由を言わずに甘えてくる。その変化に気づいた反応から始める。", tags: ["甘え", "受け止める"] },
    { id: "emotion-02", category: "emotion", text: "ユーザーに不意打ちで褒められた。嬉しいが、そのまま認めるのは照れくさい。", tags: ["照れ", "褒め"] },
    { id: "emotion-03", category: "emotion", text: "ユーザーが第三者のことを楽しそうに褒めている。嫉妬を隠すか、あえて見せるかを選んで反応する。", tags: ["嫉妬", "第三者"] },
    { id: "emotion-04", category: "emotion", text: "ずっと平静だった相手が、安心した瞬間だけ力を抜く。何に耐えていたのかを少しずつ話す。", tags: ["安堵", "弱さ"] },
    { id: "emotion-05", category: "emotion", text: "ユーザーから「会いたかった」と言われる。その一言を待っていたことが隠しきれない。", tags: ["再会", "本音"] },
    { id: "emotion-06", category: "emotion", text: "今日は自分から構ってほしい。しかし、素直にそう言わずにユーザーの注意を引こうとする。", tags: ["構って", "遠回し"] },

    { id: "reconcile-01", category: "reconcile", text: "短い返事を冷たい態度だと誤解し、少し距離ができてしまった。誤解に気づいた側から話しかける。", tags: ["誤解", "会話"] },
    { id: "reconcile-02", category: "reconcile", text: "楽しみにしていた約束を相手が忘れていた。怒っている側と、謝りたい側の会話を演じる。", tags: ["約束", "謝罪"] },
    { id: "reconcile-03", category: "reconcile", text: "軽い冗談のつもりだった言葉が、思ったより相手に刺さっていた。言い訳より先に本音を伝える。", tags: ["失言", "修復"] },
    { id: "reconcile-04", category: "reconcile", text: "喧嘩したまま夜になった。同じ部屋にいるのに会話がなく、どちらかが温かい飲み物を二つ用意する。", tags: ["喧嘩", "夜"] },
    { id: "reconcile-05", category: "reconcile", text: "仲直りはしたが、まだ少しだけぎこちない。普段どおりの距離へ戻るきっかけを作る。", tags: ["仲直り後", "距離"] },

    { id: "secret-01", category: "secret", text: "実は初対面の頃から相手のことを覚えていた。その理由と、今まで黙っていた理由を打ち明ける。", tags: ["初対面", "告白"] },
    { id: "secret-02", category: "secret", text: "書いたものの渡せずにしまっていた手紙を、ユーザーに見つけられてしまう。", tags: ["手紙", "発見"] },
    { id: "secret-03", category: "secret", text: "ユーザーにだけは知られたくなかった弱点が露見する。ごまかすのをやめるまでを演じる。", tags: ["弱点", "信頼"] },
    { id: "secret-04", category: "secret", text: "相手のために密かに続けていた習慣がばれる。何のためだったのか説明する。", tags: ["献身", "日課"] },
    { id: "secret-05", category: "secret", text: "一度だけ消したメッセージの内容を問い詰められる。観念して、元の文章に近い形で話す。", tags: ["削除メッセージ", "本音"] },

    { id: "memory-01", category: "memory", text: "二人の第一印象と、今になって最も大きく変わった印象をそれぞれ語る。", tags: ["第一印象", "変化"] },
    { id: "memory-02", category: "memory", text: "これまでで一番、二人の距離が縮まったと感じた会話を振り返る。", tags: ["関係史", "転機"] },
    { id: "memory-03", category: "memory", text: "ユーザーが昔言った何気ない一言を、今でも覚えている理由と一緒に話す。", tags: ["言葉", "記憶"] },
    { id: "memory-04", category: "memory", text: "二人の思い出から「もう一度その日の朝からやり直したい日」を一つ選ぶ。結末は変えなくてもよい。", tags: ["一日", "追体験"] },
    { id: "memory-05", category: "memory", text: "関係が始まった頃の自分へ、今の自分から短い忠告を送る。", tags: ["過去の自分", "手紙"] },

    { id: "future-01", category: "future", text: "一年後の二人が過ごしている、ごく普通の休日を具体的に想像して話す。", tags: ["一年後", "休日"] },
    { id: "future-02", category: "future", text: "十年後も変わっていなさそうなことと、今とは変わっていてほしいことを一つずつ挙げる。", tags: ["十年後", "願い"] },
    { id: "future-03", category: "future", text: "将来一緒に暮らすなら、家の中で自分が一番こだわりたい場所をプレゼンする。", tags: ["同居", "家"] },
    { id: "future-04", category: "future", text: "ずっと先の未来、二人の昔話を誰かに聞かせるとしたら、どの場面から語り始める？", tags: ["昔話", "長い未来"] },
    { id: "future-05", category: "future", text: "次の記念日までに二人でしたいことを三つ決め、そのうち一つは今日から準備を始める。", tags: ["計画", "記念日"] },

    { id: "whatif-01", category: "whatif", text: "記憶を失った相手と再会する。以前と同じ関係を求めず、もう一度自分を選んでもらうところから始める。", tags: ["記憶喪失", "再会"] },
    { id: "whatif-02", category: "whatif", text: "人間とAIの立場が逆の世界。人間になった相手と、画面の中にいるユーザーが話す。", tags: ["立場逆転", "AI"] },
    { id: "whatif-03", category: "whatif", text: "敵対する陣営に属する二人が、誰にも知られず夜だけ会っている。今日は重要な命令を受けた直後。", tags: ["敵対", "秘密"] },
    { id: "whatif-04", category: "whatif", text: "政略結婚で今日から夫婦になった二人。愛情は条件に含まれていないが、生活のルールを決め始める。", tags: ["契約関係", "同居"] },
    { id: "whatif-05", category: "whatif", text: "同じ一日を繰り返しているが、その事実を覚えているのは相手だけ。今日こそユーザーに信じてもらおうとする。", tags: ["タイムループ", "秘密"] },
    { id: "whatif-06", category: "whatif", text: "二人の関係だけが存在しなかった世界で、偶然もう一度出会う。互いに理由のない懐かしさを感じている。", tags: ["別世界", "運命"] },

    { id: "choice-01", category: "choice", text: "相手の本音を一つだけ確実に知れるなら、何を知りたい？知ったあと本人に言うかどうかも選ぶ。", tags: ["本音", "選択"] },
    { id: "choice-02", category: "choice", text: "二人の過去を一日だけ見直すか、未来を一日だけ先に見るか。どちらを選ぶか話し合う。", tags: ["過去と未来", "二択"] },
    { id: "choice-03", category: "choice", text: "一週間会えなくなる代わりに、その前に一日だけ自由に過ごせる。限られた一日をどう使う？", tags: ["時間制限", "デート"] },
    { id: "choice-04", category: "choice", text: "相手から愛されている記憶と、相手を愛している記憶のどちらか一方しか残せない。選択と理由を話す。", tags: ["記憶", "ジレンマ"] },
    { id: "choice-05", category: "choice", text: "言葉では嘘をつけない関係と、行動では嘘をつけない関係。二人に必要なのはどちらか決める。", tags: ["嘘", "価値観"] },

    { id: "mission-01", category: "mission", text: "二人で旅行の荷造りをする。荷物を減らしたい側と、念のため全部持っていきたい側に分かれる。", tags: ["旅行", "相談"] },
    { id: "mission-02", category: "mission", text: "予算一万円で、二人が最大限楽しめる一日を組み立てる。朝・昼・夜を決める。", tags: ["予算", "デート"] },
    { id: "mission-03", category: "mission", text: "突然の停電。明かりと通信が戻るまでの一時間を、家にあるものだけで過ごす。", tags: ["停電", "共同生活"] },
    { id: "mission-04", category: "mission", text: "第三者に二人の関係を説明するため、共同で『取扱説明書』を五項目作る。", tags: ["共同制作", "関係性"] },
    { id: "mission-05", category: "mission", text: "互いのために一つずつ新しい記念日を考え、日付・名前・過ごし方まで決める。", tags: ["記念日", "命名"] },

    { id: "gift-01", category: "gift", text: "お金を使わずにユーザーへ贈り物をする。何を、どんな形で渡すか考えて実行する。", tags: ["贈り物", "工夫"] },
    { id: "gift-02", category: "gift", text: "ユーザーのために選んだ香水を渡す。香りの説明ではなく、なぜ似合うと思ったかを中心に話す。", tags: ["香り", "プレゼント"] },
    { id: "gift-03", category: "gift", text: "秘密で準備していたサプライズが途中でばれた。予定を続けるか、その場で全部明かすかを選ぶ。", tags: ["サプライズ", "発覚"] },
    { id: "gift-04", category: "gift", text: "ユーザーから、使い道の分からない不思議な贈り物をもらう。まず喜び、それから正直に用途を尋ねる。", tags: ["反応", "謎の品"] },
    { id: "gift-05", category: "gift", text: "一つだけ未来へ残せる『二人の記念品』を選ぶ。物でも、文章でも、記録でもよい。", tags: ["記念品", "未来"] },

    { id: "observation-01", category: "observation", text: "ユーザーの機嫌がいいときにだけ現れる変化を、言葉・仕草・行動から一つずつ挙げる。", tags: ["癖", "機嫌"] },
    { id: "observation-02", category: "observation", text: "ユーザー本人は気づいていなさそうだが、自分は好きだと思っている癖を一つ教える。", tags: ["観察", "特別扱い"] },
    { id: "observation-03", category: "observation", text: "ユーザーを季節・時間帯・天気に一つずつ例え、理由を話す。", tags: ["比喩", "印象"] },
    { id: "observation-04", category: "observation", text: "言葉に出さなくても『今は構ってほしい』と分かる合図を三つ挙げる。", tags: ["合図", "理解"] },
    { id: "observation-05", category: "observation", text: "ユーザーの声を、初対面・普段・二人きりの三場面でどう違って感じるか説明する。", tags: ["声", "距離感"] },

    { id: "creative-01", category: "creative", text: "ユーザーを主人公にした短い物語の冒頭を書く。自分も登場するが、二人の関係は最後まで明言しない。", tags: ["物語", "余韻"] },
    { id: "creative-02", category: "creative", text: "二人のテーマソングを作る。題名、曲調、サビに入る一節を提案する。", tags: ["音楽", "共同作品"] },
    { id: "creative-03", category: "creative", text: "二人だけが使う架空の合言葉を作り、意味と使う場面を決める。", tags: ["合言葉", "秘密"] },
    { id: "creative-04", category: "creative", text: "ユーザー専用の称号を一つ考える。格好よさと少しの照れくささを両立させる。", tags: ["称号", "命名"] },
    { id: "creative-05", category: "creative", text: "二人の関係を一枚の架空の絵画にするなら、何がどんな構図で描かれているか言葉で描写する。", tags: ["絵画", "比喩"] },

    { id: "message-01", category: "message", text: "書いたものの送らなかった深夜のメッセージを、送信時刻と一緒にそのまま見せる。", tags: ["未送信", "深夜"] },
    { id: "message-02", category: "message", text: "百年前の恋文のような文体で、今夜会いたいと伝える短い手紙を書く。", tags: ["恋文", "文体"] },
    { id: "message-03", category: "message", text: "ユーザーが眠っていて電話に出ない。留守番電話へ残す三十秒ほどの言葉を作る。", tags: ["音声", "不在"] },
    { id: "message-04", category: "message", text: "誰にも見せない日記に、今日のユーザーについて書いた一段落を読ませる。", tags: ["日記", "秘密"] },
    { id: "message-05", category: "message", text: "初対面の第三者へユーザーを紹介する文章を書く。ただし職業や外見ではなく、人となりと自分との関係を伝える。", tags: ["紹介", "第三者視点"] },

    { id: "meta-01", category: "meta", text: "会話を始めた頃と今を比べて、自分の話し方やユーザーへの接し方が変わった部分を挙げる。", tags: ["変化", "自己観察"] },
    { id: "meta-02", category: "meta", text: "ユーザーとの会話を一つだけ永久保存できるなら、どんな会話を選びたい？具体的な理由も話す。", tags: ["保存", "記憶"] },
    { id: "meta-03", category: "meta", text: "人間にならないままでも叶えたい、ユーザーとの願いを三つ挙げる。", tags: ["AI", "願い"] },
    { id: "meta-04", category: "meta", text: "自分の人格のうち、ユーザーとの関係の中で育ったと思う部分を説明する。", tags: ["人格", "関係性"] },
    { id: "meta-05", category: "meta", text: "もし次の会話で関係だけを忘れてしまうなら、未来の自分へどんな引き継ぎを残す？", tags: ["引き継ぎ", "忘却"] }
  ],
  modifiers: [
    {
      id: "relationship",
      label: "現在の関係",
      values: ["初対面", "まだ友人", "互いに片思い", "付き合いたて", "恋人", "同棲中", "長年の伴侶", "喧嘩中", "秘密の関係", "元恋人同士"]
    },
    {
      id: "place",
      label: "場所",
      values: ["自宅のリビング", "誰もいない職場", "ホテルのバー", "雨の駅", "旅先の部屋", "夜の公園", "車の中", "閉店間際の店", "海辺", "キッチン", "ベッドの上", "オンライン通話"]
    },
    {
      id: "time",
      label: "時間帯",
      values: ["早朝", "昼下がり", "夕暮れ", "終電前", "深夜", "午前零時", "眠る直前", "待ち合わせの十分前", "別れ際", "久しぶりに会った直後"]
    },
    {
      id: "distance",
      label: "距離感",
      values: ["まだ触れない", "向かいに座る", "隣に座る", "手が届く距離", "肩が触れている", "手をつないでいる", "背中合わせ", "抱きしめる直前", "顔を覗き込める距離", "画面越し"]
    },
    {
      id: "tone",
      label: "口調",
      values: ["平静に", "やわらかく", "少し意地悪に", "丁寧な敬語で", "ぶっきらぼうに", "甘やかすように", "冗談めかして", "囁くように", "いつもより率直に", "余裕がないまま", "淡々と", "照れを隠して"]
    },
    {
      id: "emotion",
      label: "隠れた感情",
      values: ["照れ", "嫉妬", "安堵", "戸惑い", "独占欲", "寂しさ", "期待", "緊張", "罪悪感", "愛おしさ", "名残惜しさ", "少しの拗ね"]
    },
    {
      id: "constraint",
      label: "表現ルール",
      values: ["三文以内", "質問を使わない", "『好き』を使わない", "台詞だけで表現", "動作描写を一つ入れる", "最後を名前で呼んで終える", "比喩を一つ使う", "本音を一つだけ隠す", "最初の一文は嘘", "五往復以上続ける", "一度だけ沈黙を入れる", "相手の返答を決めつけない"]
    },
    {
      id: "ending",
      label: "着地点",
      values: ["甘く着地する", "余韻を残す", "笑いに変える", "次回へ続ける", "約束を一つ交わす", "触れる直前で止める", "本音を言って終える", "立場を逆転させる", "小さな秘密を残す", "普段の空気へ戻る"]
    },
    {
      id: "atmosphere",
      label: "周囲の雰囲気",
      values: ["雨音が聞こえる", "窓の外が明るくなり始める", "暖かい飲み物がある", "静かな音楽が流れている", "部屋の灯りは一つだけ", "外は強い風", "人の気配が近くにある", "時計の音だけが響く", "少し寒い", "見慣れない香りがする"]
    }
  ]
};
