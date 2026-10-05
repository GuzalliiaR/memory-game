// Создает DOM - элемент с атрибутами(в виде объекта {}) и дочерними узлами(простое перечисление начиная с третьего аргумента)
export function createElement(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);
    const arrAttributes = Object.entries(attributes);

    arrAttributes.forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            for (const [dataKey, dataVal] of Object.entries(value)) {
                element.dataset[dataKey] = dataVal;
            }
        } else if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else if (key === 'textContent') {
            element.textContent = value;
        } else {
            element.setAttribute(key, value);
        }
    });

    for (const child of children) {
        if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(String(child)));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    };

    return element;
}

// Очистка содержимого внутри container (без container.innerHTML = '')
export function clearElement(container) {
    while (container.firstChild) {
        container.firstChild.remove();
    }
}