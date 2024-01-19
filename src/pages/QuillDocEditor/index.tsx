import React, { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import {Button} from "antd";
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import 'quill/dist/quill.snow.css'; // 引入 Quill 的样式文件
import 'quill-cursors/dist/quill-cursors.js'; // 引入 quill-cursors 的样式文件
const QuillDocEditor = () => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const providerRef = useRef(null);
    useEffect(() => {
        Quill.register('modules/cursors', QuillCursors)
        connectWebSocket()
            return () => {
                // Cleanup logic, if needed
            };
    }, [])
    const connectWebSocket = () => {

        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
            `ws${':'}/localhost:3000/ws`,
            'quill',
            ydoc
        );

        const ytext = ydoc.getText('quill')

        if (editorRef.current) {
            const editor = new Quill(editorRef.current, {
                modules: {
                    cursors: true,
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        ['image', 'code-block']
                    ],
                    history: {
                        userOnly: true
                    }
                },
                placeholder: 'Start collaborating...',
                theme: 'snow', // or 'bubble'
                // cursors: {
                //     autoRegisterListener: false,
                // },
            })

            // 设置用户信息
            provider.awareness.setLocalStateField('user', {
                name: 'Username', // 设置用户名
                color: 'skyblue', // 设置用户颜色
            });
            providerRef.current = provider;
            quillRef.current = editor;
            const binding = new QuillBinding(ytext, editor, provider.awareness)
            window.example = { provider, ydoc, ytext, binding, Y };
            // Cleanup function
            return () => {
                binding.destroy();
                quillRef.current = null;
                // Disconnect WebSocket on component unmount
                if (providerRef.current) {
                    providerRef.current.disconnect();
                    providerRef.current = null;
                }
            };
        }
    };
    return (
        // Render the component
        <div>
            {/*<Button onClick={connectWebSocket}>*/}
            {/*    {editText}*/}
            {/*</Button>*/}
            {/*<Button onClick={handleConnectClick}>*/}
            {/*    {buttonText}*/}
            {/*</Button>*/}
            <div ref={editorRef}></div>
        </div>
    );
};

export default QuillDocEditor;
