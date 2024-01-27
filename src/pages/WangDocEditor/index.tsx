import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import 'quill-cursors/dist/quill-cursors.js'; // 引入 quill-cursors 的样式文件
import 'quill/dist/quill.snow.css'; // 引入 Quill 的样式文件
import { useEffect, useRef, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const wangDocEditor = () => {
  const providerRef = useRef(null);
  const websocketRef = useRef(null);
  const editorRef = useRef(null);
  const ytextRef = useRef(null);
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  // 编辑器内容
  const [html, setHtml] = useState('<p>hello</p>');

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setHtml('<p>hello world</p>');
    }, 1500);
  }, []);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    placeholder: '请输入内容...',
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
      providerRef.current = null;
    };
  }, [editor]);
  const connectWebSocket = () => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      `ws${':'}/localhost:3000/ws`,
      'wangeditor',
      ydoc,
    );
    const ytext = ydoc.getText('wangeditor-content');
    ytextRef.current = ytext;
    // 等待 Websocket 连接建立后开始同步
    provider.on('status', (event) => {
      if (event.status === 'connected') {
        // 同步 Yjs 文档和 WangEditor 编辑器的内容
        syncContent();
      }
      if (event.status === 'disconnected') {
        ydoc.destroy();
        editor.destroy();
      }
    });

    // 同步 Yjs 文档和 WangEditor 编辑器的内容
    function syncContent() {
      // 获取 Y.Text 对象的当前内容
      const yjsContent = ytext.toString();
      // 将 Y.Text 对象的内容设置到 WangEditor 编辑器中
      setHtml(yjsContent);
    }

    console.log('provider', provider);

    // 在文档内容变化时，可以监听 Yjs 文档的事件并同步到 WangEditor
    ytext.observe((event) => {
      const content = ytext.toString();
      console.log('ytext', ytext);

      console.log('content', content);
      // editor.txt.html(content);
    });
    provider.ws.onopen = handleOnopen;
    provider.ws.onmessage = handleOnmessage;
    provider.ws.onclose = handleOnclose;
    provider.ws.onerror = handleOnerror;
    // 设置用户信息
    provider.awareness.setLocalStateField('user', {
      name: 'Username', // 设置用户名
      color: 'skyblue', // 设置用户颜色
    });
    providerRef.current = provider;
    // const binding = new QuillBinding(ytext, editorRef.current, provider.awareness)
    // 将 WebSocket 实例存储在 ref 中
    websocketRef.current = provider.ws;
    // window.example = { provider, ydoc, ytext, binding, Y };
    // Cleanup function
  };

  function handleOnmessage(e) {
    console.log('handleOnmessage', e);
  }

  function handleOnopen(e) {
    console.log('handleOnopen', e);
  }

  function handleOnclose(e) {
    console.log('handleOnclose', e);
  }

  function handleOnerror(e) {
    console.log('handleOnerror', e);
  }

  function handleEditorChange(editor) {
    console.log('editor', editor);
    // const content = editor?.getHtml()
    // if (content === html) return
    // if (content.length > html.length)
    // setHtml(content)
    // // ytextRef.current.toString(content);
    // ytextRef.current.insert(0, content);
  }

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          ref={editorRef}
          onCreated={setEditor}
          onChange={(editor) => handleEditorChange(editor)}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
      <div style={{ marginTop: '15px' }}>{html}</div>
    </>
  );
};

export default wangDocEditor;
