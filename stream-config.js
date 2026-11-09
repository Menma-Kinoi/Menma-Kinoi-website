/*
  🩷 次回配信の登録はここだけ編集すればOK！
  例の先頭の // を外し、title・startAt・url を自分の枠の情報に変えてね。
  複数登録すると開始日時順に表示するよ。

  startAt の +09:00 は日本時間（JST）という意味。
  URL は YouTube で作った配信待機所のURLにすること。
  例： https://www.youtube.com/watch?v=XXXXXXXXXXX

  設定例：
  window.MENMA_STREAMS = [
    {
      title: "例：今夜の歌枠！", 
      startAt: "2026-12-01T21:00:00+09:00",
      url: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
      category: "歌枠"
    }
  ];

  ※ 上記は説明のための架空の日時。実際の予定ではありません。
  ※ YouTube予約枠を作っただけでは自動反映されません。
*/
window.MENMA_STREAMS = [];
