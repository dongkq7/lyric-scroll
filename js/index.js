
/**
 * 将字符串歌词解析成歌词对象数组（包含time和lyric）
 * @returns 解析后的歌词数组
 */
function parseLyric() {
  const lyricLines = lrc.split('\n')
  const lyricList = []
  lyricLines.forEach(lyric => {
    const list = lyric.split(']')
    const lyricObj = {
      time: parseTime(list[0].slice(1)),
      lyric: list[1]
    }
    lyricList.push(lyricObj);
  })
  return lyricList
}
/**
 * 将时间字符串转成秒
 * @param {*} timeStr 
 */
function parseTime(timeStr) {
  const times = timeStr.split(':')
  return +times[0] * 60 + +times[1]
}
const lyricList = parseLyric()

/**
 * 防止变量冲突
 */
const doms = {
  audio: document.querySelector('audio'),
  ul: document.querySelector('.container ul'),
  container: document.querySelector('.container')
}
function findLyricIndex() {
  const curTime = doms.audio.currentTime
  for(let i = 0; i < lyricList.length; i++) {
    if (lyricList[i].time > curTime) {
      return i - 1
    }
  }
  return lyricList.length - 1
}

function createLyricElements() {
  const frag = document.createDocumentFragment()
  lyricList.forEach(item => {
    const li = document.createElement('li')
    li.textContent = item.lyric
    frag.appendChild(li)
  })
  doms.ul.appendChild(frag)
}
createLyricElements()

const containerHeight = doms.container.clientHeight
const liHeight = doms.ul.children[0].clientHeight // li元素节点高度
const maxOffset = doms.ul.clientHeight - containerHeight // 歌词列表最大偏移量
function setOffset() {
  // 找到当前时间播放到的歌词索引
  const index = findLyricIndex()
  let offset = liHeight * index + liHeight / 2 - containerHeight / 2
  if (offset < 0) {
    offset = 0
  }
  if (offset > maxOffset) {
    offset = maxOffset
  }
  doms.ul.style.transform = `translateY(-${offset}px)`
  let li = doms.ul.querySelector('.active')
  // 去掉之前设置过的active
  if (li) {
    li.classList.remove('active')
  }
  li = doms.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}
doms.audio.addEventListener('timeupdate', setOffset)