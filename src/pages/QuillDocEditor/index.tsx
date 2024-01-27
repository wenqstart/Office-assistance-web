import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import 'quill/dist/quill.snow.css'; // 引入 Quill 的样式文件
// import 'quill-cursors/dist/quill-cursors.js'; // 引入 quill-cursors 的样式文件
const QuillDocEditor = () => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const providerRef = useRef(null);
    const websocketRef = useRef(null);
    useEffect(() => {
        initEditorAndWss()
            return () => {
                // Cleanup function
                return () => {
                    binding.destroy();
                    quillRef.current = null;
                    // Disconnect WebSocket on component unmount
                    if (websocketRef.current) {
                        websocketRef.current.close();
                    }
                    if (providerRef.current) {
                        providerRef.current.disconnect();
                        providerRef.current = null;
                    }
                };
            };
    }, [])
    useEffect(() => {
        if (quillRef.current) {
            quillRef.current.on('text-change', (delta, oldDelta, source) => {
                if (source === 'user') {
                    // 用户输入触发的变化才发送消息
                    const content = quillRef.current.root.innerHTML;
                    sendMessageToBackend(content);
                }
            });
        }
    }, [quillRef.current])
    function handleOnmessage(e) {
        console.log('handleOnmessage', e)
    }
    function handleOnopen(e) {
        console.log('handleOnopen', e)
    }
    function handleOnclose(e) {
        console.log('handleOnclose', e)
    }
    function handleOnerror(e) {
        console.log('handleOnerror', e)
    }
    function sendMessageToBackend (content) {
        // 通过 WebSocket 发送消息到后端
        console.log('providerRef.current', providerRef.current, content)
        // 使用 WebSocket 实例的 send 方法发送消息
        if (websocketRef.current) {
            websocketRef.current.send(content);
        }
    };
    const initEditorAndWss = () => {
        Quill.register('modules/cursors', QuillCursors)
        const ydoc = new Y.Doc();
        const wsProvider = new WebsocketProvider(
            `ws://localhost:3000/ws`,
            'wqstart',
            // `wss://demos.yjs.dev`,
            // 'quill-demo-room',
            ydoc
        );
        wsProvider.on('status', event => {
            console.log('status', event.status) // logs "connected" or "disconnected"
        })
        const ytext = ydoc.getText('wqstart')
        wsProvider.ws.onopen = handleOnopen
        wsProvider.ws.onmessage = handleOnmessage
        wsProvider.ws.onclose = handleOnclose
        wsProvider.ws.onerror = handleOnerror
        if (editorRef.current) {
            const editor = new Quill(editorRef.current, {
                modules: {
                    cursors: true,
                    toolbar: [
                        [{ font: [] }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ script: 'sub' }, { script: 'super' }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['blockquote', 'code-block'],
                        ['link', 'image', 'video'],
                        ['clean'],
                    ],
                    history: {
                        userOnly: true
                    }
                },
                placeholder: '山上沙锅...',
                theme: 'snow', // or 'bubble'
                // cursors: {
                //     autoRegisterListener: false,
                // },
            })
            const color = "#" + Math.random().toString(16).split(".")[1].slice(0, 6);
            // 设置用户信息
            wsProvider.awareness.setLocalStateField('user', {
                name: 'user-' + color, // 设置用户名
                color, // 设置用户颜色
            });
            providerRef.current = wsProvider;
            quillRef.current = editor;
            const binding = new QuillBinding(ytext, editor, wsProvider.awareness)
            websocketRef.current = wsProvider.ws;
            window.example = { wsProvider, ydoc, ytext, binding, Y };
        }

    };
    return (
        <div>
            <div ref={editorRef}></div>
        </div>
    );
};

export default QuillDocEditor;
