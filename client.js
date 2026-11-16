/**
 * Browser half of `dsh-plugin-manager-plus`.
 *
 * Enhances the official Plugins page **in place** instead of adding a tab:
 *
 * - Its three groups (built-in settings, experimental plugins, installed plugins)
 *   become one view at a time, switched by a small segmented control injected at
 *   the top of the Installed tab's list.
 * - Every card of the installed group gets a Chinese display name where the
 *   English name was, the original name as an elliptical pill beside it, and a
 *   one-line Chinese summary under the original description, with a colored
 *   category tag.
 *
 * The page is React-owned, so this layer only ever adds attribute/class/style
 * changes and appends its own nodes (never moves or removes host nodes), and a
 * MutationObserver re-applies the decoration after host re-renders.
 *
 * The generated data placeholders are replaced by `scripts/build.mjs`; edit this
 * source, then rebuild `client.js`.
 */
window.__ModuleLoader__.load({
  id: 'dsh-plugin-manager-plus',
  factory: (require) => {
    const React = require('react');

    /* ------------------------------------------------------------------ *
     * Generated data (scripts/build.mjs replaces the markers below)
     * ------------------------------------------------------------------ */
    const CONTENT = {"packages":{"dshmarket":{"name":"插件市场","summary":"在 Harness 内浏览、搜索并一键安装社区插件","tag":"插件市场","tagTone":"blue"},"@deepseek-ai/dsh-experimental-session-admin":{"name":"会话清理","summary":"在会话列表中永久删除会话及其活动记录、缓存、事件日志与关联提醒","tag":"会话管理","tagTone":"rose"},"@linxin666/dsh-client-ui-task-board":{"name":"任务看板","summary":"创建任务卡片并交由真实会话执行，支持子任务、定时调度与自动验收","tag":"任务看板","tagTone":"violet"},"@tt-a1i/archify-dsh":{"name":"架构图工坊","summary":"把代码库或需求描述生成可交互的架构图、流程图与数据流图","tag":"架构图","tagTone":"slate"},"@vectorize-io/hindsight-coding-agents":{"name":"项目记忆","summary":"自动沉淀仓库历史与对话，让每个新会话都带着项目长期记忆","tag":"知识记忆","tagTone":"green"},"@wxg-prc-cpg/browser-skill-dsh-plugin":{"name":"浏览器助手","summary":"让模型用浏览器打开网页、填写表单、点击操作并截图取证","tag":"浏览器自动化","tagTone":"blue"},"billion-context":{"name":"十亿上下文","summary":"把长对话增量压缩成摘要，让单个会话在有限窗口内持续运行数天","tag":"上下文管理","tagTone":"cyan"},"dsh-blender":{"name":"Blender 建模套件","summary":"提供从建模、贴图、动画到渲染导出的 Blender 流水线与验收工具","tag":"3D 建模","tagTone":"amber"},"dsh-blender-plugin":{"name":"Blender 直连","summary":"把 AI 接进运行中的 Blender，实时看视口、执行 Python 并检查导出结果","tag":"3D 建模","tagTone":"amber"},"dsh-claude-design":{"name":"Claude 设计工作台","summary":"用画板式画布生成可编辑设计稿，支持并排预览、改文案与导出 PNG","tag":"设计生成","tagTone":"rose"},"dsh-claude-motion":{"name":"Claude 动效工作室","summary":"把讲解、产品演示与片头写成分镜代码，在本地播放器预览并导出视频","tag":"动效制作","tagTone":"amber"},"dsh-context":{"name":"上下文洞察","summary":"用仪表盘展示上下文组成、Token 消耗与演变趋势，并可跳转到任一会话","tag":"上下文管理","tagTone":"cyan"},"dsh-context-manager":{"name":"上下文管理器","summary":"分级设置上下文容量与压缩策略，查看压缩记录与空间释放统计","tag":"上下文管理","tagTone":"cyan"},"dsh-ops":{"name":"Ops 工具集","summary":"用更省 Token 的 ops 系列工具替代官方文件与命令工具，减少调用轮次","tag":"效率工具","tagTone":"slate"},"dsh-sidebar-console":{"name":"侧栏控制台","summary":"长按拖动调整左侧面板顺序，并可批量隐藏或显示不常用入口","tag":"侧栏管理","tagTone":"green"},"dsh-status-rotator":{"name":"状态行轮播","summary":"把运行状态行换成自定义文案，支持打字机、昼夜渐变、弹幕与梗词库","tag":"界面美化","tagTone":"rose"},"dsh-plugin-manager-plus":{"name":"插件管理增强","summary":"改造官方插件已安装页：分组切换查看，并为每个插件显示中文名称与彩色用途摘要","tag":"界面增强","tagTone":"violet"},"@momasiku/dsh-pilot":{"name":"桌面操控","summary":"让模型看见真实屏幕并直接操作鼠标键盘，可驱动 CAD、WPS、浏览器等桌面软件","tag":"桌面自动化","tagTone":"cyan"}},"meta":{"generatedAt":"2026-11-13","count":18}};
    const DICT_ZH = {"groupBuiltin":"内置插件配置","groupExperimental":"实验性插件","groupInstalled":"已安装插件","controlLabel":"插件分类视图","note":"中文名称与用途摘要由「插件管理增强」提供","openLabel":"查看 {name}","originalName":"原始名称","emptyCategory":"该分类暂无条目","fallbackTag":"第三方插件","fallbackSummary":"第三方插件，提供「{name}」相关能力。"};
    const DICT_EN = {"groupBuiltin":"Built-in plugin settings","groupExperimental":"Experimental plugins","groupInstalled":"Installed plugins","controlLabel":"Plugin category views","note":"Chinese names and summaries are provided by Plugin manager plus","openLabel":"View {name}","originalName":"Original name","emptyCategory":"No entry in this category","fallbackTag":"Third-party","fallbackSummary":"A third-party plugin for {name}."};

    /* ------------------------------------------------------------------ *
     * Constants: the official page's automation hooks
     * ------------------------------------------------------------------ */
    const NS = 'pluginManagerPlus';
    const STYLE_ID = 'dsh-plugin-manager-plus-style';
    const STORAGE_KEY = 'dsh-plugin-manager-plus:category';
    const PANEL_SELECTOR = '[data-plugin-panel]';
    const BODY_SELECTOR = '[data-plugin-body]';
    const GROUP_SELECTOR = '[data-plugin-group]';
    const CONTROL_ATTR = 'data-pmp-control';
    const CATEGORY_ATTR = 'data-pmp-category';
    const NAME_CLASS = 'pmp-name-zh';
    const NAME_HIDDEN_CLASS = 'pmp-name-zhified';
    const PILL_CLASS = 'pmp-orig';
    const SUMMARY_CLASS = 'pmp-summary';

    /** Categories of the Installed tab: our id, the host's group id, and the label key. */
    const CATEGORIES = [
      { id: 'basic', group: 'basic', labelKey: 'groupBuiltin' },
      { id: 'experimental', group: 'extensions', labelKey: 'groupExperimental' },
      { id: 'installed', group: 'bundles', labelKey: 'groupInstalled' },
    ];

    /* ------------------------------------------------------------------ *
     * Pure helpers
     * ------------------------------------------------------------------ */
    const CJK_RE = /[\u2e80-\u2eff\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/;
    const LATIN_RE = /[A-Za-z]/;
    const TONE_NAMES = ['blue', 'violet', 'green', 'amber', 'rose', 'cyan', 'slate'];

    function hasCjk(text) {
      return typeof text === 'string' && CJK_RE.test(text);
    }

    /** True when a display title is English (latin letters, no CJK). */
    function isEnglishTitle(text) {
      return typeof text === 'string' && LATIN_RE.test(text) && !hasCjk(text);
    }

    /** Curated Chinese name / summary / tag for one package, when present. */
    function curatedFor(packageName) {
      if (!CONTENT || !CONTENT.packages || typeof packageName !== 'string') return undefined;
      const entry = CONTENT.packages[packageName];
      if (!entry || typeof entry !== 'object') return undefined;
      return entry;
    }

    function normalizeTone(tone) {
      return TONE_NAMES.indexOf(tone) >= 0 ? tone : 'slate';
    }

    /** Word-level fallback translation for English titles without curated data. */
    const WORD_MAP = {
      'plugin-manager': '插件管理',
      'plugin': '插件',
      'plugins': '插件',
      'market': '市场',
      'experimental': '实验性',
      'personalized': '个性化',
      'recommendations': '推荐',
      'inspector': '检查器',
      'profile': '配置',
      'cua': '计算机操作',
      'cot': '思维链',
      'translation': '翻译',
      'session': '会话',
      'sessions': '会话',
      'search': '搜索',
      'titles': '标题',
      'badge': '徽章',
      'skill': '技能',
      'ralph': 'Ralph',
      'forge': '锻造',
      'liveshare': '实时共享',
      'review': '评审',
      'auto': '自动',
      'plus': '增强',
      'bundle': '',
      'voice': '语音',
      'input': '输入',
      'team': '团队',
      'agent': '智能体',
      'agents': '智能体',
      'subagent': '子智能体',
      'context': '上下文',
      'manager': '管理器',
      'memory': '记忆',
      'hindsight': '记忆',
      'coding': '编程',
      'task': '任务',
      'board': '看板',
      'design': '设计',
      'motion': '动效',
      'blender': 'Blender',
      'browser': '浏览器',
      'index': '索引',
      'status': '状态',
      'rotator': '轮播',
      'sidebar': '侧栏',
      'console': '控制台',
      'terminal': '终端',
      'worktree': '工作树',
      'tool': '工具',
      'tools': '工具',
      'admin': '管理',
      'cleanup': '清理',
      'history': '历史',
      'project': '项目',
      'projects': '项目',
      'github': 'GitHub',
      'codex': 'Codex',
      'claude': 'Claude',
      'code': '代码',
      'workflow': '工作流',
      'schedule': '日程',
      'schedules': '日程',
      'notes': '笔记',
      'backup': '备份',
      'update': '更新',
      'hot': '热更新',
      'vision': '视觉',
      'image': '图像',
      'images': '图像',
      'docs': '文档',
      'document': '文档',
      'files': '文件',
      'file': '文件',
      'shell': '终端',
      'web': '网页',
      'fetch': '抓取',
      'api': 'API',
      'chat': '对话',
      'conversation': '对话',
      'message': '消息',
      'model': '模型',
      'models': '模型',
      'provider': '提供方',
      'usage': '用量',
      'stats': '统计',
      'data': '数据',
      'local': '本地',
      'remote': '远程',
      'server': '服务',
      'test': '测试',
      'testing': '测试',
      'debug': '调试',
      'lint': '检查',
      'format': '格式化',
      'prompt': '提示词',
      'completion': '补全',
      'component': '组件',
      'components': '组件',
      'extension': '扩展',
      'extensions': '扩展',
      'settings': '设置',
      'setting': '设置',
      'config': '配置',
      'configure': '配置',
      'panel': '面板',
      'widget': '小部件',
      'dashboard': '仪表盘',
      'notification': '通知',
      'notifications': '通知',
      'custom': '自定义',
      'quick': '快捷',
      'action': '动作',
      'actions': '动作',
      'command': '命令',
      'commands': '命令',
      'shortcut': '快捷键',
      'shortcuts': '快捷键',
      'suggestion': '建议',
    };

    /** Split a package-ish English title into Chinese words, keeping unknown latin words. */
    function translateTitle(raw) {
      if (typeof raw !== 'string' || raw === '') return '';
      const text = raw.replace(/^@[^/]+\//, '').replace(/^dsh[-_]/i, '');
      const parts = text.split(/[\s\-_/]+/).filter(Boolean);
      const out = [];
      for (const part of parts) {
        const lower = part.toLowerCase();
        if (WORD_MAP[lower] !== undefined) {
          if (WORD_MAP[lower] !== '') out.push(WORD_MAP[lower]);
        } else out.push(part);
      }
      const joined = out.join('');
      return CJK_RE.test(joined) ? joined : '';
    }

    /** Chinese display name plus the original title when a translation applies. */
    function displayNameFor(packageName, rawTitle) {
      const curated = curatedFor(packageName);
      let translated = '';
      if (isEnglishTitle(rawTitle)) {
        if (curated && typeof curated.name === 'string' && hasCjk(curated.name)) translated = curated.name;
        else translated = translateTitle(rawTitle);
      }
      return {
        raw: rawTitle,
        text: translated !== '' ? translated : rawTitle,
        translated: translated !== '',
      };
    }

    /** Chinese one-line summary plus its category tag and tone. */
    function summaryFor(packageName, rawTitle, descriptionText, t) {
      const curated = curatedFor(packageName);
      if (curated && typeof curated.summary === 'string' && curated.summary !== '') {
        return {
          text: curated.summary,
          tag: typeof curated.tag === 'string' && curated.tag !== '' ? curated.tag : t('fallbackTag'),
          tone: normalizeTone(curated.tagTone),
        };
      }
      if (hasCjk(descriptionText)) return { text: descriptionText, tag: t('fallbackTag'), tone: 'slate' };
      return { text: t('fallbackSummary', { name: rawTitle }), tag: t('fallbackTag'), tone: 'slate' };
    }

    function readStoredCategory() {
      try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        for (const category of CATEGORIES) if (category.id === value) return value;
      } catch (_error) {
        /* private mode or unavailable storage: fall through */
      }
      return 'installed';
    }

    function storeCategory(value) {
      try {
        window.localStorage.setItem(STORAGE_KEY, value);
      } catch (_error) {
        /* optional convenience only */
      }
    }

    /* ------------------------------------------------------------------ *
     * Styles (structure uses theme tokens; tag hues are mixed with them)
     * ------------------------------------------------------------------ */
    const CSS = `
.pmp-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.pmp-control { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.pmp-segmented { display: inline-flex; align-self: flex-start; gap: 4px; padding: 3px; border-radius: var(--dsw-radius-md); background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1); }
.pmp-seg { appearance: none; cursor: pointer; font: inherit; font-size: 13px; line-height: 20px; display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: calc(var(--dsw-radius-md) - 2px); border: 1px solid transparent; background: transparent; color: var(--dsw-alias-label-secondary); }
.pmp-seg:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.pmp-seg:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.pmp-seg[aria-selected="true"] { background: var(--dsw-alias-bg-layer-1); border-color: var(--dsw-alias-border-l2); color: var(--dsw-alias-label-primary); box-shadow: var(--dsw-elevation-prominent); }
.pmp-count { font-size: 11px; line-height: 16px; min-width: 18px; padding: 0 5px; text-align: center; border-radius: 999px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-2); }
.pmp-seg[aria-selected="true"] .pmp-count { color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-active); }
.pmp-note { color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 16px; }
.pmp-empty { padding: 24px 0; text-align: center; color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 20px; }
.pmp-orig { flex: none; font-size: 11px; line-height: 18px; padding: 1px 9px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); }
.pmp-name-zhified { font-size: 0 !important; }
.pmp-name-zhified .pmp-name-zh { font-size: 14px; font-weight: 500; line-height: 20px; }
.pmp-summary { display: flex; align-items: flex-start; gap: 8px; padding: 8px 10px; border-radius: var(--dsw-radius-md); border-left: 3px solid var(--pmp-tone, var(--dsw-alias-brand-primary)); background: var(--dsw-alias-bg-layer-2); background: color-mix(in srgb, var(--pmp-tone, var(--dsw-alias-brand-primary)) 9%, transparent); }
.pmp-summary-text { font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-primary); text-align: left; }
.pmp-tag { flex: none; margin-top: 1px; font-size: 11px; line-height: 18px; padding: 1px 9px; border-radius: 999px; white-space: nowrap; border: 1px solid color-mix(in srgb, var(--pmp-tone, var(--dsw-alias-border-l2)) 34%, transparent); background: color-mix(in srgb, var(--pmp-tone, var(--dsw-alias-bg-layer-2)) 16%, transparent); color: color-mix(in srgb, var(--pmp-tone, var(--dsw-alias-label-secondary)) 62%, var(--dsw-alias-label-primary)); }
.pmp-tone-blue { --pmp-tone: hsl(214 88% 52%); }
.pmp-tone-violet { --pmp-tone: hsl(265 72% 58%); }
.pmp-tone-green { --pmp-tone: hsl(152 58% 40%); }
.pmp-tone-amber { --pmp-tone: hsl(35 88% 48%); }
.pmp-tone-rose { --pmp-tone: hsl(345 74% 55%); }
.pmp-tone-cyan { --pmp-tone: hsl(190 76% 42%); }
.pmp-tone-slate { --pmp-tone: hsl(220 14% 52%); }
`;

    /* ------------------------------------------------------------------ *
     * DOM helpers
     * ------------------------------------------------------------------ */
    function create(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function elementText(node) {
      return node && typeof node.textContent === 'string' ? node.textContent.trim() : '';
    }

    /** The card's title button is the first button of the card (the switch comes later). */
    function titleButtonOf(card) {
      return card.querySelector('button');
    }

    /** The installed list panel; null on detail pages and on the Experimental "More" page. */
    function findInstalledPanel(panel) {
      const body = panel.querySelector(BODY_SELECTOR);
      if (!body) return null;
      const firstGroup = body.querySelector(GROUP_SELECTOR);
      if (!firstGroup || firstGroup.getAttribute('data-plugin-group') === 'more') return null;
      return firstGroup.parentElement;
    }

    function groupOf(installedPanel, id) {
      return installedPanel.querySelector(`[data-plugin-group="${id}"]`);
    }

    function countCards(group, selector) {
      return group ? group.querySelectorAll(selector).length : 0;
    }

    /* ------------------------------------------------------------------ *
     * Decorator: injected control, category filter, card translation
     * ------------------------------------------------------------------ */
    function createDecorator(ctx) {
      const t = ctx.locale.bind(NS);

      let category = readStoredCategory();
      let observer = null;
      let scheduled = false;
      let disposed = false;
      let styleEl = null;
      let controlEl = null;
      let emptyEl = null;
      let panelEl = null;
      let decorateFailureLogged = false;
      const controlButtons = new Map();

      function schedule() {
        if (disposed || scheduled) return;
        scheduled = true;
        const run = () => {
          scheduled = false;
          if (!disposed) decorate();
        };
        if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(run);
        else window.setTimeout(run, 16);
      }

      function ensureStyle() {
        if (styleEl && styleEl.isConnected) return;
        styleEl = document.getElementById(STYLE_ID);
        if (styleEl) return;
        styleEl = create('style');
        styleEl.id = STYLE_ID;
        styleEl.textContent = CSS;
        document.head.appendChild(styleEl);
      }

      function buildControl() {
        const control = create('div', 'pmp-control');
        control.setAttribute(CONTROL_ATTR, '');
        const bar = create('div', 'pmp-bar');
        const segmented = create('div', 'pmp-segmented');
        segmented.setAttribute('role', 'tablist');
        segmented.setAttribute('aria-label', t('controlLabel'));
        bar.appendChild(segmented);
        bar.appendChild(create('span', 'pmp-note', t('note')));
        control.appendChild(bar);
        for (const item of CATEGORIES) {
          const button = create('button', 'pmp-seg');
          button.type = 'button';
          button.setAttribute('role', 'tab');
          button.setAttribute('data-pmp-cat', item.id);
          const label = create('span', 'pmp-seg-label');
          const count = create('span', 'pmp-count');
          button.appendChild(label);
          button.appendChild(count);
          button.addEventListener('click', () => {
            category = item.id;
            storeCategory(item.id);
            decorate();
          });
          controlButtons.set(item.id, { button, label, count, key: item.labelKey });
          segmented.appendChild(button);
        }
        return control;
      }

      function updateControl(counts) {
        for (const item of CATEGORIES) {
          const entry = controlButtons.get(item.id);
          if (!entry) continue;
          const label = t(entry.key);
          if (entry.label.textContent !== label) entry.label.textContent = label;
          const value = String(counts[item.id] || 0);
          if (entry.count.textContent !== value) entry.count.textContent = value;
          const selected = category === item.id ? 'true' : 'false';
          if (entry.button.getAttribute('aria-selected') !== selected) {
            entry.button.setAttribute('aria-selected', selected);
          }
        }
      }

      function ensureControl(installedPanel) {
        if (!controlEl || !controlEl.isConnected || controlEl.parentElement !== installedPanel) {
          controlEl = buildControl();
          installedPanel.insertBefore(controlEl, installedPanel.firstChild);
        }
        if (!emptyEl || !emptyEl.isConnected) {
          emptyEl = create('div', 'pmp-empty', t('emptyCategory'));
          const anchor = controlEl && controlEl.isConnected ? controlEl : installedPanel.firstChild;
          installedPanel.insertBefore(emptyEl, anchor ? anchor.nextSibling : null);
        }
      }

      function applyCategory(installedPanel, groups) {
        installedPanel.setAttribute(CATEGORY_ATTR, category);
        let visible = false;
        for (const item of CATEGORIES) {
          const group = groups[item.group];
          if (!group) continue;
          const show = category === item.id;
          if (show) visible = true;
          group.style.display = show ? '' : 'none';
        }
        if (emptyEl) {
          const text = t('emptyCategory');
          if (emptyEl.textContent !== text) emptyEl.textContent = text;
          const display = visible ? 'none' : '';
          if (emptyEl.style.display !== display) emptyEl.style.display = display;
        }
      }

      function decorateCard(card) {
        const name = card.getAttribute('data-plugin-package');
        if (!name) return;
        const titleBtn = titleButtonOf(card);
        if (!titleBtn) return;
        const storedRaw = titleBtn.getAttribute('data-pmp-raw');
        const raw = storedRaw || elementText(titleBtn);
        if (!raw) return;
        if (!storedRaw) titleBtn.setAttribute('data-pmp-raw', raw);
        const info = displayNameFor(name, raw);
        const titleRow = titleBtn.parentElement;
        const cardMain = titleRow ? titleRow.parentElement : null;
        if (!titleRow || !cardMain) return;

        /* Name: a Chinese span inside the button; the host text is hidden by CSS. */
        let zhSpan = titleBtn.querySelector('.' + NAME_CLASS);
        if (info.translated) {
          if (!zhSpan) {
            zhSpan = create('span', NAME_CLASS);
            titleBtn.appendChild(zhSpan);
          }
          if (zhSpan.textContent !== info.text) zhSpan.textContent = info.text;
          if (!titleBtn.classList.contains(NAME_HIDDEN_CLASS)) titleBtn.classList.add(NAME_HIDDEN_CLASS);
          const aria = t('openLabel', { name: info.text });
          if (titleBtn.getAttribute('aria-label') !== aria) titleBtn.setAttribute('aria-label', aria);
          let pill = titleRow.querySelector('.' + PILL_CLASS);
          if (!pill) {
            pill = create('span', PILL_CLASS);
            pill.title = t('originalName');
            titleRow.insertBefore(pill, titleBtn.nextSibling);
          }
          if (pill.textContent !== info.raw) pill.textContent = info.raw;
        } else {
          if (zhSpan) zhSpan.remove();
          titleBtn.classList.remove(NAME_HIDDEN_CLASS);
          const pill = titleRow.querySelector('.' + PILL_CLASS);
          if (pill) pill.remove();
        }

        /* Summary: below the original description, inside the card's main column. */
        let descEl = null;
        for (const child of cardMain.children) {
          if (child === titleRow) continue;
          if (child.classList.contains(SUMMARY_CLASS)) continue;
          descEl = child;
          break;
        }
        const description = elementText(descEl);
        const summary = summaryFor(name, raw, description, t);
        const key = `${raw}|${summary.tag}|${summary.tone}|${summary.text}`;
        let block = cardMain.querySelector(':scope > .' + SUMMARY_CLASS);
        if (!block) {
          block = create('div', SUMMARY_CLASS);
          cardMain.appendChild(block);
        }
        if (block.getAttribute('data-pmp-key') !== key) {
          block.setAttribute('data-pmp-key', key);
          block.className = SUMMARY_CLASS + ' pmp-tone-' + normalizeTone(summary.tone);
          block.textContent = '';
          const tag = create('span', 'pmp-tag', summary.tag);
          const text = create('span', 'pmp-summary-text', summary.text);
          block.appendChild(tag);
          block.appendChild(text);
        }
      }

      function decorateInstalled(group) {
        if (!group) return;
        const cards = group.querySelectorAll('li[data-plugin-package]');
        for (const card of cards) {
          try {
            decorateCard(card);
          } catch (_error) {
            /* one broken card must not stop the rest of the list */
          }
        }
      }

      function decorate() {
        if (disposed || !document.body) return;
        try {
          ensureStyle();
          panelEl = document.querySelector(PANEL_SELECTOR);
          if (!panelEl) return;
          const installedPanel = findInstalledPanel(panelEl);
          if (!installedPanel) return;
          const groups = {
            basic: groupOf(installedPanel, 'basic'),
            extensions: groupOf(installedPanel, 'extensions'),
            bundles: groupOf(installedPanel, 'bundles'),
          };
          if (!groups.basic && !groups.extensions && !groups.bundles) return;
          ensureControl(installedPanel);
          updateControl({
            basic: countCards(groups.basic, '[data-plugin-item]'),
            experimental: countCards(groups.extensions, 'li[data-plugin-package]'),
            installed: countCards(groups.bundles, 'li[data-plugin-package]'),
          });
          applyCategory(installedPanel, groups);
          decorateInstalled(groups.bundles);
        } catch (error) {
          /* A host-DOM change must not throw on every animation frame. */
          if (!decorateFailureLogged) {
            decorateFailureLogged = true;
            try {
              // eslint-disable-next-line no-console
              console.error('plugin-manager-plus: decorating the Plugins page failed', error);
            } catch (_error) {
              /* logging must never throw */
            }
          }
        }
      }

      function cleanup() {
        try {
          if (observer) observer.disconnect();
        } catch (_error) {
          /* already gone */
        }
        observer = null;
        try {
          if (styleEl) styleEl.remove();
        } catch (_error) {
          /* already gone */
        }
        styleEl = null;
        for (const node of document.querySelectorAll(`.${PILL_CLASS}, .${SUMMARY_CLASS}, .pmp-empty`)) node.remove();
        for (const node of document.querySelectorAll(`.${NAME_CLASS}`)) node.remove();
        for (const node of document.querySelectorAll(`.${NAME_HIDDEN_CLASS}`)) node.classList.remove(NAME_HIDDEN_CLASS);
        for (const node of document.querySelectorAll(`[${CONTROL_ATTR}]`)) node.remove();
        for (const node of document.querySelectorAll(`[${CATEGORY_ATTR}]`)) node.removeAttribute(CATEGORY_ATTR);
        for (const node of document.querySelectorAll(GROUP_SELECTOR)) node.style.removeProperty('display');
        controlEl = null;
        emptyEl = null;
        controlButtons.clear();
      }

      function start() {
        ensureStyle();
        observer = new MutationObserver(() => schedule());
        observer.observe(document.body, { childList: true, subtree: true });
        const offLocale = ctx.locale.subscribe(() => schedule());
        schedule();
        return () => {
          disposed = true;
          try {
            offLocale();
          } catch (_error) {
            /* already disposed */
          }
          cleanup();
        };
      }

      return { start, decorate };
    }

    /* ------------------------------------------------------------------ *
     * Plugin halves
     * ------------------------------------------------------------------ */
    /** Lifecycle anchor only: registering makes this browser half observable and mounted. */
    function LifecycleAnchor() {
      return null;
    }

    const inject = ['slots', 'locale'];

    function apply(ctx) {
      ctx.effect(() => {
        const disposeZh = ctx.locale.register(NS, 'zh', DICT_ZH);
        const disposeEn = ctx.locale.register(NS, 'en', DICT_EN);
        return () => {
          disposeZh();
          disposeEn();
        };
      }, 'plugin-manager-plus: dictionaries');

      ctx.effect(() => {
        const decorator = createDecorator(ctx);
        return decorator.start();
      }, 'plugin-manager-plus: installed page decoration');

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'plugin-manager-plus',
            locale: NS,
          },
          LifecycleAnchor,
        ),
      );
    }

    return {
      inject: inject,
      apply: apply,
      /* Exposed for the offline model check in tests/model.test.mjs. */
      __model: {
        hasCjk,
        isEnglishTitle,
        translateTitle,
        displayNameFor,
        summaryFor,
        curatedFor,
        normalizeTone,
      },
    };
  },
});
