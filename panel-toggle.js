const panel = document.getElementById('panel');
const toggle = document.createElement('button');
toggle.id = 'panel-toggle';
toggle.type = 'button';
toggle.setAttribute('aria-controls', 'panel');
const style = document.createElement('style');
style.textContent = `#panel-toggle{position:fixed;right:24px;top:12px;z-index:5;min-height:40px;background:#fffaf0f5;box-shadow:0 3px 16px #32401c20}#panel{top:62px;max-height:calc(100dvh - 183px)}#panel[hidden]{display:none!important}@media(max-width:700px){#panel-toggle{right:10px;top:12px}#panel{top:100px;max-height:calc(100dvh - 220px)}}`;
document.head.append(style);
document.body.append(toggle);
function setCollapsed(collapsed) {
  panel.hidden = collapsed;
  toggle.textContent = collapsed ? '☰ 显示面板' : '收起面板 ›';
  toggle.setAttribute('aria-expanded', String(!collapsed));
}
let collapsed = false;
try { collapsed = localStorage.getItem('town-panel-collapsed') === 'true'; } catch {}
setCollapsed(collapsed);
toggle.addEventListener('click', () => {
  setCollapsed(!panel.hidden);
  try { localStorage.setItem('town-panel-collapsed', String(panel.hidden)); } catch {}
});
