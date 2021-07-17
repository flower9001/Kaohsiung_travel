let data = [];
let nowPage = 1;
const selectArea = document.querySelector('.selectArea');
const list = document.querySelector('.list');
const mainAreaName = document.querySelector('.mainAreaName');
const popularArea = document.querySelector('.popularArea');
const page = document.querySelector('.page');

// 使用 axios 串接外部資料
axios.get('https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c')
    .then(function(response) {
        const webData = response.data.data.XML_Head.Infos.Info;
        let arr = [];
        let areaNameArray = []

        webData.forEach(function(item) {
            let info = {};
            info.Name = item.Name;
            info.county = item.Add.substr(0, 3);
            info.Opentime = item.Opentime;
            info.Add = item.Add;
            info.Tel = item.Tel;
            info.Area = item.Add.substr(6, 3);
            info.Picture = item.Picture1;
            if (item.Ticketinfo == '免費' || item.Ticketinfo == '' || item.Ticketinfo == '免費入園') {
                info.Ticketinfo = '免費參觀';
            } else {
                info.Ticketinfo = '';
            }
            arr.push(info.Area);
            data.push(info);
        });
        // get unique values
        areaNameArray.push(...new Set(arr));

        areaNameArray.forEach(function(item) {
            let str = document.createElement('option');
            str.textContent = `${item}`;
            str.setAttribute('value', `${item}`);
            selectArea.appendChild(str);
        });

        mainAreaName.innerHTML = '高雄市全區';
        showArea('all', 1);
    })

// show area
function showArea(area, pageNum) {
    let str = '';
    let arr = [];
    let len = 0;
    let pageStr = '<a href="#" class="prev">< prev</a>';

    // data length
    if (area == 'all') {
        arr = data;
        len = arr.length;
    } else {
        data.forEach(function(item) {
            if (item.Area == area) {
                arr.push(item)
            }
        });
        len = arr.length;
    };

    // total page
    if (len % 10 == 0) {
        count = Math.floor(len / 10);
    } else {
        count = Math.ceil(len / 10);
    }

    for (let i=0; i<count; i++) {
        // show page
        if (i + 1 == pageNum) {
            pageStr += `<a href="#" data-page="${i+1}" class='text-blue'>${i+1}</a>`;
        } else if (count > 10) {
            if (i < 10 && pageNum < 6) {
                pageStr += `<a href="#" data-page="${i+1}">${i+1}</a>`;
            } else if (i >= (pageNum - 5) && i < (pageNum + 5) && pageNum < (count - 4)) {
                pageStr += `<a href="#" data-page="${i+1}">${i+1}</a>`;
            } else if (i >= (count - 10) && pageNum >= (count - 4)){
                pageStr += `<a href="#" data-page="${i+1}">${i+1}</a>`;
            }
        } else {
            pageStr += `<a href="#" data-page="${i+1}">${i+1}</a>`;
        }
        
        // show area
        if(pageNum == i + 1) {
            arr.forEach(function(item, index){
                if (index >= i * 10 && index < (i + 1) * 10) {
                    str += 
                    `
                    <section class="card col-6 col-md-11 col-sm-12">
                        <div class="areaData">
                            <div class="img">
                                <img src="${item.Picture}" alt="image">
                                <p class='name'>${item.Name}</p>
                                <p class='areaName'>${item.Area}</p>
                            </div>
                            <div class="info">
                                <div class="col-9 col-sm-8">
                                    <p class="time"><i class="fas fa-clock fa-lg b"></i>${item.Opentime}</p>
                                    <p class="address"><i class="fas fa-map-marker-alt fa-lg"></i>${item.Add}</p>
                                    <p class="tel"><i class="fas fa-mobile-alt fa-lg"></i>${item.Tel}</p>
                                </div>
                                <p class="tag col-3 col-sm-4"><i class="fas fa-tag fa-lg"></i>${item.Ticketinfo}</p>
                            </div>
                        </div>
                    </section>
                    `
                }
            })
        }
    }

    pageStr += '<a href="#" class="next">next ></a>';
    list.innerHTML = str;
    page.innerHTML = pageStr;
};



// select area
selectArea.addEventListener('change', function(e) {
    nowPage = 1;
    if (selectArea.value == '- - 請選擇行政區- -') {
        return;
    }
    mainAreaName.textContent = selectArea.value;
    showArea(selectArea.value, nowPage);
});

// click popular area
popularArea.addEventListener('click', function(e) {
    nowPage = 1;
    if (e.target.nodeName != 'A') {
        return;
    }
    selectArea.value = e.target.textContent;
    mainAreaName.textContent = selectArea.value;
    showArea(e.target.textContent, nowPage);
})

// select page
page.addEventListener('click', function(e) {

    e.preventDefault();

    let area = '';

    if (e.target.nodeName != 'A') {
        return;
    };

    if (e.target.textContent != 'next >' && e.target.textContent != '< prev') {
        nowPage = parseInt(e.target.textContent);
    };

    if (mainAreaName.textContent == '高雄市全區') {
        area = 'all';
    } else {
        area = selectArea.value;
    };

    if (e.target.textContent == 'next >') {  // next page
        if (nowPage == count) {
            return;
        }
        nowPage += 1;
        showArea(area, nowPage);
        return;
    } else if (e.target.textContent == '< prev') {  // previous page
        if (nowPage == 1) {
            return;
        };
        nowPage -= 1;
        showArea(area, nowPage);
        return;
    }

    showArea(area, nowPage);
})