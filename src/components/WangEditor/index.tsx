import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Boot } from '@wangeditor/editor'
import ctrlEnterModule from '@wangeditor/plugin-ctrl-enter'

Boot.registerModule(ctrlEnterModule)

// Then create editor and toolbar
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
// import { addAttachment, download } from '@/services/attachment';
import Viewer from 'react-viewer'
import { defaultToolBarConfig } from './data'

interface PageProps {
  toolbarConfig?: Partial<IToolbarConfig>
  content: string
  style?: any
}

let imgList: any[] = []

const MyEditor: React.FC<PageProps> = (props, ref) => {
  const { toolbarConfig = defaultToolBarConfig, content, style } = props
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  const [html, setHtml] = useState('')
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0)
  const [visible, setVisible] = useState(false)

  // toolbarConfig.excludeKeys = ['group-video']

  useImperativeHandle(ref, () => {
    // return返回的值就可以被父组件获取到
    return {
      html,
      setHtml,
    }
  })

  const findAllImgSrcsFromHtml = (htmlData: string) => {
    const imgReg = /(?<=(img[^>]*src="))[^"]*/g
    const srcArr = htmlData.match(imgReg)
    return srcArr
  }

  useEffect(() => {
    setHtml(content)
  }, [content])

  useEffect(() => {
    if (html) {
      const imgs =
        document.querySelector('.editorContent')?.getElementsByTagName('img') ||
        []
      imgList = [...imgs].map((v) => ({ dom: v, src: v.src }))
    }
  }, [html])

  useEffect(() => {
    document
      .querySelector('.editorContent')
      ?.addEventListener('dblclick', (e) => {
        if (e.target) {
          const index = imgList.findIndex((v) => v.dom === e.target)
          setCurrentImgIndex(index > -1 ? index : 0)
          if (index > -1) setVisible(true)
        }
      })
  }, [])

  const base64ImgToFile = (dataurl: any, filename = 'file') => {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) u8arr[n] = bstr.charCodeAt(n)
    return new File([u8arr], `${filename}.${suffix}`, { type: mime })
  }

  const replaceImagesFileSourceWithInlineRepresentation = async (
    htmlData: string,
    imageSrcs: string | any[],
  ) => {
    if (imageSrcs.length) {
      for (let i = 0; i < imageSrcs.length; i++) {
        if (imageSrcs[i].indexOf('data:image/') > -1) {
          const tempArr = imageSrcs[i].split('/')
          const fileName = tempArr.pop()
          const file = base64ImgToFile(imageSrcs[i], fileName)
          const formData = new FormData()
          formData.append('files', file)
          // const res = await addAttachment(formData);
          // if (res.code === 0) {
          //   const resp = await download({ id: res.data[0] });
          //   if (resp.code === 0)
          //     htmlData = htmlData.replace(imageSrcs[i], resp.data);
          // }
        }
      }
    }
    return htmlData
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: any) {
          const formData = new FormData()
          formData.append('files', file)
          // addAttachment(formData).then((res) => {
          //   if (res.code === 0) {
          //     download({ id: res.data[0] }).then((resp) => {
          //       if (resp.code === 0) insertFn(resp.data, file.name, resp.data);
          //     });
          //   }
          // });
        },
      },
      uploadVideo: {
        async customUpload(file: File, insertFn: any) {
          const formData = new FormData()
          formData.append('files', file)
          // addAttachment(formData).then((res) => {
          //   if (res.code === 0) {
          //     download({ id: res.data[0] }).then((resp) => {
          //       if (resp.code === 0) insertFn(resp.data, file.name, resp.data);
          //     });
          //   }
          // });
        },
      },
    },
    customPaste: (editor: IDomEditor, e: ClipboardEvent) => {
      let html = e.clipboardData?.getData('text/html') // 获取粘贴的 html
      // const rtf = e.clipboardData?.getData('text/rtf')
      if (html) {
        // 列表缩进会超出边框，直接过滤掉
        html = html.replace(/text-indent:-(.*?)pt/gi, '')
        // 从html内容中查找粘贴内容中是否有图片元素，并返回img标签的属性src值的集合
        const imgSrcs = findAllImgSrcsFromHtml(html)
        if (imgSrcs && Array.isArray(imgSrcs) && imgSrcs.length) {
          replaceImagesFileSourceWithInlineRepresentation(html, imgSrcs).then(
            (resHtml) => {
              const str = resHtml
                .replace(/<!--(.*?)-->/gi, '')
                .replace(/<link(.*?)>/gi, '')
                .replace(/<meta(.*?)>/gi, '')
                .replace(/<html(.*?)>/gi, '<html>')
                .replace(/<style>(.*?)<\style>/gi, '')
                .replace(/<xml>(.*?)<\/xml>/gi, '')
                .replace(/<xml>[\s\S]*?<\/xml>/gi, '')
                .replace('/(\\n|\\r| class=(")?Mso[a-zA-Z]+(")?)/g', '')

              editor.dangerouslyInsertHtml(str)
            },
          )
        } else {
          editor.dangerouslyInsertHtml(html)
        }
        // 阻止默认的粘贴行为
        e.preventDefault()
        return false
      } else return true
    },
  }
  // 使用 ctrl+enter 或 cmd+enter 换行。
  function handleKeydown(params: any) {
    const { keyCode, ctrlKey, metaKey } = params
    // ctrl 17 enter 13 meta 91
      // 发送消息
      if (keyCode === 13 && !ctrlKey && !metaKey) {
        console.log('send');
        
      }
    console.log(params)
  }
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (editor === null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div>
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" />
        <Editor
          className="editorContent"
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          onKeydown={handleKeydown}
          mode="default"
          style={{ height: '100px', overflowY: 'hidden', ...style }}
        />
      </div>
      {/* <div style={{ marginTop: '15px' }}>{html}</div> */}
      <Viewer
        visible={visible}
        onClose={() => {
          setVisible(false)
          setCurrentImgIndex(0)
        }}
        activeIndex={currentImgIndex}
        zIndex={100000}
        images={imgList}
        drag={false}
      />
    </>
  )
}

export default React.forwardRef(MyEditor)
