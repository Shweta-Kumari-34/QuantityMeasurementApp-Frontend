const fs = require('fs');
const file = 'd:/ConnectSphere/ConnectSphere-Frontend/src/app/pages/search/search.component.scss';
let content = fs.readFileSync(file, 'utf8');

const modalCss = `
/* ── Reel Preview Modal ── */
.reel-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
.reel-modal-content {
  background: #111827;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
.reel-modal-close {
  position: absolute;
  top: 12px; right: 12px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  width: 32px; height: 32px;
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  &:hover { background: rgba(0,0,0,0.8); }
}
.reel-modal-video {
  width: 100%;
  height: auto;
  max-height: 60vh;
  object-fit: cover;
}
.reel-modal-info {
  padding: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.reel-modal-author {
  font-weight: 700;
  font-size: 15px;
}
.reel-modal-caption {
  font-size: 14px;
  color: #d1d5db;
  margin: 0;
  line-height: 1.4;
}
.reel-modal-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 8px;
}
.reel-modal-cta .btn-primary {
  width: 100%;
  padding: 10px;
  text-align: center;
  justify-content: center;
}
`;

if (!content.includes('.reel-modal-overlay')) {
  fs.writeFileSync(file, content + modalCss);
}
console.log('done');
