(function () {
    ; `use strict`
    const userNameInput = document.getElementById('user-name');  // input
    const assessmentButton = document.getElementById('assessment');
    const resultDivided = document.getElementById('result-area');
    const tweetDivided = document.getElementById('tweet-area');
    const headerDivided = document.getElementById('rotateH');  //onclickで要素を回転

    /**
     * 指定したHTML要素の子どもを全て削除する
     * @param {HTMLElement} element HTML HTMLの要素
     */
    function removeAllChildren(element) {
        while (element.firstChild) {  // 子どもの要素があるかぎりループ削除
            element.removeChild(element.firstChild);
        }
    }


    // 診断ボタンonclickで動く f関数
    assessmentButton.onclick = () => {
        const userName = userNameInput.value;
        if (userName.length === 0) {  // 名前が空のときは 処理を終了する
            return;
        }


        // firstChildのelementを削除
        removeAllChildren(resultDivided);
        removeAllChildren(tweetDivided);


        // 診断エリアの作成   ==> header,result のdiv要素
        const header = document.createElement('h3');
        header.innerText = '診断結果';
        resultDivided.appendChild(header);
        const paragraph = document.createElement('p');
        const result = assessment(userName);
        paragraph.innerText = result;
        resultDivided.appendChild(paragraph);


        //  ツイートエリアの作成　id="tweet-area"
        const anchor = document.createElement('a');
        const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag='
            + encodeURIComponent('あなたのいいところ')
            + '&ref_src=twsrc%5Etfw';
        anchor.setAttribute('href', hrefValue);
        anchor.className = 'twitter-hashtag-button';
        anchor.setAttribute('data-text', result);
        anchor.innerText = 'Tweet #あなたのいいところ';
        tweetDivided.appendChild(anchor);


        // htmlファイルの<script>タグも、こちらに移植[リバースエンジニアリング？]
        const script = document.createElement('script');
        script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
        script.setAttribute('charset', 'utf-8');
        tweetDivided.appendChild(script);


        // <h4>ヘッダーの中身を書き換える
        removeAllChildren(headerDivided);
        const header4 = document.createElement('h3');
        header4.innerText = '診断結果をclickすると戻ります';
        headerDivided.appendChild(header4);


        // header要素を動かす transform f関数
        var rotateH = document.getElementById('rotateH');
        var cf = 0;
        function rotateHeader() {
            cf = cf + 36;
            rotateH.style.transform = 'rotateX(' + cf + 'deg)';
        }
        var slide = document.getElementById('slide');
        var yr = 0;
        function slideHeader() {
            yr = yr + 5;
            slide.style.transform = `translateY(${yr}px)`;
            slide.style.backgroundColor = `#eaf598`;
        }

        // ヘッダーが1秒で５周して正面で停止
        var rotateX = setInterval(rotateHeader, 20);
        setTimeout(() => {
            clearInterval(rotateX);
        }, 1000);

        // h4ヘッダーが動いて診断ボタンを隠す
        var moveY = setInterval(slideHeader, 20);
        function moveYStop() {
            clearInterval(moveY);
        }
        setTimeout(moveYStop, 790);


        // ボタンを一度だけ押せる呪文
        assessmentButton.disabled = true;
    };


    // Enterキーを押すと、ボタンの処理を呼び出す
    userNameInput.onkeydown = (event) => {
        if (event.key === 'Enter') {
            // ボタンのonclick()処理を呼び出す
            assessmentButton.onclick();
        }
    };


    const answer = [
        '{userName}のいいところは声です。{userName}の特徴的な声は皆を惹きつけ、心に残ります。',
        '{userName}のいいところはまなざしです。{userName}に見つめられた人は、気になって仕方がないでしょう。',
        '{userName}のいいところは情熱です。{userName}の情熱に周りの人は感化されます。',
        '{userName}のいいところは厳しさです。{userName}の厳しさがものごとをいつも成功に導きます。',
        '{userName}のいいところは知識です。博識な{userName}を多くの人が頼りにしています。',
        '{userName}のいいところはユニークさです。{userName}だけのその特徴が皆を楽しくさせます。',
        '{userName}のいいところは用心深さです。{userName}の洞察に、多くの人が助けられます。',
        '{userName}のいいところは見た目です。内側から溢れ出る{userName}の良さに皆が気を惹かれます。',
        '{userName}のいいところは決断力です。{userName}がする決断にいつも助けられる人がいます。',
        '{userName}のいいところは思いやりです。{userName}に気をかけてもらった多くの人が感謝しています。',
        '{userName}のいいところは感受性です。{userName}が感じたことに皆が共感し、わかりあうことができます。',
        '{userName}のいいところは節度です。強引すぎない{userName}の考えに皆が感謝しています。',
        '{userName}のいいところは好奇心です。新しいことに向かっていく{userName}の心構えが多くの人に魅力的に映ります。',
        '{userName}のいいところは気配りです。{userName}の配慮が多くの人を救っています。',
        '{userName}のいいところはその全てです。ありのままの{userName}自身がいいところなのです。',
        '{userName}のいいところは自制心です。やばいと思ったときにしっかりと衝動を抑えられる{userName}が皆から評価されています。',
        '{userName}のいいところは優しさです。あなたの優しい雰囲気や立ち振る舞いに多くの人が癒やされています。',
        '{userName}のいいところは行動力です。周りの人を引っ張っていける力があり、{userName}の問題に対して臆することなく取り組む姿に勇気づけられます。'
    ];


    /**　JS;document  パラメーター引数の説明   returnはどんな結果を返すか？
     * 名前の文字列を渡すと、診断結果を返す f関数
     * @param {string} userName ユーザーの名前
     * @return {string} 診断結果
     */
    function assessment(userName) {
        let sumOfcharCode = 0
        for (let i = 0; i < userName.length; i++) {
            sumOfcharCode += userName.charCodeAt(i)
        }
        const index = sumOfcharCode % answer.length
        let result = answer[index]
        result = result.replace(/\{userName\}/g, userName)
        return result
    }


    // TESTcode
    console.assert(
        assessment('Aloy') === 'Aloyのいいところは思いやりです。Aloyに気をかけてもらった多くの人が感謝しています。',
        '「診断結果の文言の特定の部分を名前に置き換える」処理が正しくありません。'
    );
    console.assert(
        assessment('Rost') === assessment('Rost'),
        '「入力が同じ名前なら→同じ診断結果を出力する」処理が正しくありません。'
    );
    console.log(assessment('Aloy'));
})();
