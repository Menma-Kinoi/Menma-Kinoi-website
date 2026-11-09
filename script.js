(() => {
  'use strict';
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('menuToggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'メニューを開く' : 'メニューを閉じる');
      nav.classList.toggle('is-open', !expanded);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
      nav.classList.remove('is-open');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // YouTubeの配信予定: 配信枠URLと開始日時を手動で登録する方式。
  // 自動取得にはYouTube Data API等を安全に呼び出す別の仕組みが必要です。
  const channelURL = 'https://www.youtube.com/@kinoi_menma/streams';
  const details = document.getElementById('streamDetails');
  const showcase = document.getElementById('streamShowcase');
  const actions = document.getElementById('streamActions');
  const more = document.getElementById('moreStreams');
  const input = Array.isArray(window.MENMA_STREAMS) ? window.MENMA_STREAMS : [];
  const asID = raw => {
    try {
      const u = new URL(raw);
      const host = u.hostname.toLowerCase();
      if (host === 'youtu.be' || host === 'www.youtu.be') return u.pathname.split('/')[1] || null;
      if (host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com') {
        return u.searchParams.get('v') || (/^\/(?:live|embed|shorts)\/([\w-]{11})/.exec(u.pathname)||[])[1] || null;
      }
    } catch (_) {}
    return null;
  };
  const valid = input.map(x => ({...x, time: Date.parse(x.startAt), id: asID(x.url)}))
    .filter(x => x && typeof x.title === 'string' && Number.isFinite(x.time) && x.id && /^[\w-]{11}$/.test(x.id))
    .sort((a,b) => a.time - b.time);
  // 予定開始から8時間までは掲載。実際の配信状態を自動判定しているわけではありません。
  const upcoming = valid.filter(x => x.time > Date.now() - 8*60*60*1000);
  if (!details || !showcase || !actions || !more || upcoming.length === 0) return;
  const main = upcoming[0];
  const dateFmt = new Intl.DateTimeFormat('ja-JP', {timeZone:'Asia/Tokyo',month:'long',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit'});
  const make = (tag, cls, txt) => { const el=document.createElement(tag); if(cls)el.className=cls; if(txt!==undefined)el.textContent=txt; return el; };
  details.replaceChildren(); showcase.replaceChildren(); actions.replaceChildren();
  const media = make('div','stream-media');
  const thumb = make('img','stream-thumb');
  thumb.src = `https://i.ytimg.com/vi/${main.id}/hqdefault.jpg`;
  thumb.alt = `${main.title} のYouTube配信サムネイル`;
  thumb.loading = 'lazy';
  media.appendChild(thumb);
  const play = make('button','stream-preview-button','▶　HP内でプレビュー');
  play.type='button';
  play.setAttribute('aria-label',`${main.title} をHP内でプレビュー`);
  play.addEventListener('click',()=>{
    const frame=make('iframe','stream-iframe');
    frame.src=`https://www.youtube.com/embed/${main.id}?playsinline=1`;
    frame.title=`${main.title} / YouTubeプレーヤー`;
    frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.setAttribute('allowfullscreen','');
    media.replaceChildren(frame);
  });
  media.appendChild(play);
  showcase.appendChild(media);
  const cat = make('div','stream-category',main.category||'配信予定');
  const title=make('h3','',main.title);
  const time=make('p','stream-time','📅 '+dateFmt.format(new Date(main.time))+' JST');
  const count=make('p','stream-countdown');
  details.append(cat,title,time,count);
  const link=make('a','btn btn-primary','YouTubeの待機所へ ↗');link.href=`https://www.youtube.com/watch?v=${main.id}`;link.target='_blank';link.rel='noopener noreferrer';
  const all=make('a','btn btn-white','配信一覧も見る ↗');all.href=channelURL;all.target='_blank';all.rel='noopener noreferrer';
  actions.append(link,all);
  const refresh=()=>{
    const d=main.time-Date.now();
    if(d <= 0) { count.textContent='予定開始時刻になりました！ 配信状況はYouTubeで確認してね ♡';return; }
    const mins=Math.floor(d/60000), days=Math.floor(mins/1440),h=Math.floor(mins%1440/60),m=mins%60;
    count.textContent=`配信予定まで：${days?days+'日 ':''}${h}時間 ${m}分`;
  };
  refresh();setInterval(refresh,60*1000);
  if(upcoming.length>1){
    more.hidden=false;
    more.appendChild(make('p','more-heading','OTHER STREAMS ✦ そのほかの配信予定'));
    upcoming.slice(1,4).forEach(x=>{
      const a=make('a','more-stream-card');a.href=`https://www.youtube.com/watch?v=${x.id}`;a.target='_blank';a.rel='noopener noreferrer';
      const info=make('span','',x.title);
      const when=make('small','',dateFmt.format(new Date(x.time))+' JST ↗');
      a.append(info,when);more.appendChild(a);
    });
  }
})();
