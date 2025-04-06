/** 获取项目列表 @param {string} platform 平台 @param {string} type 类型*/
export async function GetProjectList(platform='all', type='all', ids = 'projectlist') {
    const projectlist = document.getElementById(ids);
    projectlist.innerHTML = '<img style="width:50vw;" src="/src/imge/loading.gif">';
    const url = `http://api.czgrzx.cn/GetProjectList?platform=${platform}&type=${type}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
/** 搜索项目 @param {string} names 项目名称 */
export async function FindTheProject(names,ids = 'projectlist') {
    const projectlist = document.getElementById(ids);
    projectlist.innerHTML = '<img style="width:50vw;" src="/src/imge/loading.gif">';
    const url = `http://api.czgrzx.cn/FindTheProject?names=${names}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

/** 生成元素 @param {Array} data @param {string} id 元素父级 */
export function CreateElement(data, id) {
    const ids = document.getElementById(id);
    if (data.length === 0) {
        ids.innerHTML = '<h1 style="margin:15% auto;">没有找到相关项目</h1>';
        return;
    }
    ids.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < data.length; i++) {
        const div = document.createElement('div');
        div.className = 'project';
        div.innerHTML = `
            <img class="project-icon" src="${data[i][1]}" alt="图标">
            <div class="project-info">
                <h2>项目名称:${data[i][2]}</h2>
                <p>项目开发者:${data[i][3]}</p>
                <a href="${data[i][4]}" target="_blank">项目链接:${data[i][4]}</a>
                <p>项目简介:${data[i][5]}</p>
            </div>
        `;
        fragment.appendChild(div);
    }
    ids.appendChild(fragment);
}

/** 播放音频 @param {Array} Arr 播放数组 @param {object} Audio 音频对象 */
export function AudioPlay(Arr, Audio) {
    Arr.forEach(element => {
        if (element && !element.dataset.audioBound) {
            element.addEventListener('click', () => Audio.play());
            element.dataset.audioBound = true; // 标记已绑定事件
        }
    });
}

/** 更新 URL 参数 @param {string} key 参数键 @param {string} value 参数值 */
export const updateUrlParams = (key, value) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
    const event = new Event('popstate');
    window.dispatchEvent(event);
};

/** 按钮点击处理逻辑 @param {Array} buttonArray 按钮数组 @param {HTMLElement} activeElement 激活元素 @param {string} paramKey 参数键 @param {Array} paramValues 参数值数组 */
export const handleButtonClick = (buttonArray, activeElement, paramKey, paramValues) => {
    buttonArray.forEach((item, index) => {
        item.onclick = () => {
            const rect = item.getBoundingClientRect();
            activeElement.style.left = `${rect.left + (paramKey === 'type' ? rect.width / 2.5 : 0)}px`;
            activeElement.style.width = `${rect.width}px`;
            if (paramKey === 'type') activeElement.style.top = `${rect.bottom}px`;

            const paramValue = paramValues[index];
            updateUrlParams(paramKey, paramValue);

            GetProjectList(
                new URLSearchParams(window.location.search).get('platform'),
                new URLSearchParams(window.location.search).get('type')
            )
                .then(result => CreateElement(result, 'projectlist'))
                .catch(error => console.error('Error:', error));
        };
    });
};