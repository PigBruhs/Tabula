// main.js

// Modules to control application life and create native browser window
import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import path from 'node:path'
import url from 'url'
//import path from 'path'


let __filename = url.fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

const createWindow = () => {
    // Create the browser window.
    console.log('createWindow')
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true, //允许在渲染进程中直接使用 Node.js API
            contextIsolation: true, //启用上下文隔 (提高安全性)
            preload: path.resolve(__dirname, 'preload.mjs'),

        }
    })

    // 定义菜单模板
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S', // 使用 Cmd+S (Mac) 或 Ctrl+S (Windows/Linux)
                    click: () => {
                        // 在这里添加保存文件的逻辑
                        console.log('Save file clicked')
                        mainWindow.webContents.send('save-file', 1);
                    }
                },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit()
                    }
                }
            ]
        }
    ]
    // 构建并设置菜单
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    // 加载 index.html
    mainWindow.loadFile('index.html')
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    // 打开开发工具
    mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // 在 macOS 系统内, 如果没有已开启的应用窗口
        // 点击托盘图标时通常会重新创建一个新窗口
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。


