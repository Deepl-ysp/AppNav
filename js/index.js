// 导入文件
import { AudioPlay, GetProjectList, CreateElement, FindTheProject, handleButtonClick, updateUrlParams } from "./function.js";
const Audios = new Audio('../src/audio/click2.mp3');

// 常量定义
const ButtonFrom = {
    header:[
        document.getElementById('Web'),
        document.getElementById('Win'),
        document.getElementById('Mac'),
        document.getElementById('Linux'),
        document.getElementById('Android'),
        document.getElementById('iOS')
    ],
    filter:[
        document.getElementById('All'),
        document.getElementById("Tool"),
        document.getElementById("Game"),
        document.getElementById("Learn"),
        document.getElementById("Forum"),
        document.getElementById("Amusement")
    ]
}
const projectlist = document.getElementById('projectlist');
const headeractive = document.getElementById('headeractive');
const filteractive = document.getElementById('filteractive');
const search = document.getElementById('search');
const searchbtn = document.getElementById('searchbtn');

// 函数调用
[...ButtonFrom.header, ...ButtonFrom.filter].forEach(button => AudioPlay([button], Audios));

// 调用通用函数绑定事件
const handleSearch = () => {
    const searchValue = search.value;
    FindTheProject(searchValue)
        .then(result => {
            CreateElement(result, 'projectlist');
        })
        .catch(error => {
            console.error('Error:', error);
        });
};
searchbtn.onclick = handleSearch;
search.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
});
handleButtonClick(ButtonFrom.header, headeractive, 'platform', ['web', 'win', 'mac', 'linux', 'android', 'ios']);
handleButtonClick(ButtonFrom.filter, filteractive, 'type', ['all', 'tool', 'game', 'learn', 'forum', 'amusement']);

// 初始化
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform') || 'web';
    const type = urlParams.get('type') || 'all';
    updateUrlParams('platform', platform);
    updateUrlParams('type', type);

    const updateActiveStyle = (element, activeElement, offset = 0) => {
        const rect = element.getBoundingClientRect();
        activeElement.style.left = `${rect.left + offset}px`;
        activeElement.style.width = `${rect.width}px`;
        if (offset) activeElement.style.top = `${rect.bottom}px`;
    };

    const platformIndex = ['web', 'win', 'mac', 'linux', 'android', 'ios'].indexOf(platform);
    const typeIndex = ['all', 'tool', 'game', 'learn', 'forum', 'amusement'].indexOf(type);

    if (platformIndex >= 0) updateActiveStyle(ButtonFrom.header[platformIndex], headeractive);
    if (typeIndex >= 0) updateActiveStyle(ButtonFrom.filter[typeIndex], filteractive, ButtonFrom.filter[typeIndex].getBoundingClientRect().width / 2.5);

    GetProjectList(platform, type)
        .then(data => {
            CreateElement(data, 'projectlist');
        })
        .catch(error => {
            console.error('Error:', error);
        });
};