// Keep audio activation reachable even when the controls are collapsed.
const musicButton = document.getElementById('music');
const audioButton = document.createElement('button');
audioButton.id = 'quick-audio';
audioButton.type = 'button';
audioButton.textContent = '♫ 点击开启声音';
audioButton.setAttribute('aria-label', '开启音乐与环境音');
const style = document.createElement('style');
style.textContent = '#quick-audio{position:fixed;left:12px;bottom:88px;z-index:5;min-height:44px;background:#fffaf0f5;box-shadow:0 3px 16px #32401c20}';
document.head.append(style);
document.body.append(audioButton);
audioButton.addEventListener('click', () => musicButton.click());
const sync = () => {
  audioButton.disabled = musicButton.disabled;
  const playing = musicButton.classList.contains('active');
  audioButton.textContent = musicButton.disabled ? '♫ 正在开启声音…' : playing ? '♫ 暂停声音' : '♫ 点击开启声音';
  audioButton.setAttribute('aria-label', playing ? '暂停音乐与环境音' : '开启音乐与环境音');
  audioButton.setAttribute('aria-pressed', String(playing));
};
new MutationObserver(sync).observe(musicButton, {attributes:true,childList:true,subtree:true});
sync();
