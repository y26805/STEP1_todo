$(loaded);

// YES/NOを押すとToDoリストが表示される
$(document).ready(function(){
    $(".answer").click(function(){
      $(".prompt").hide();
      $("#todo").show();
    });
    $(".yes").click(function(){
      $(".yes").show("slow");
    });
    $(".no").click(function(){
      $(".no").show("slow");
    });
    $("#clear").click(function(){
      var isSure = confirm("タスクをすべて削除しますか？※タスクが実際に消えるわけではありません。")
      if (isSure){
        localStorage.clear();
        showTask();
      }
    });
    $("#done").click(function(){
      var index = [];
      $(".output:checked").each(function(){
        index.push($(this).val());
      });
      deleteTask(index);
      showTask();
    });
});

function loaded() {
  showTask();
  // ボタンをクリックしたときに実行するイベントを設定する
  $("#formButton").click(
    // コールバックとしてメソッドを引数にわたす
    function() {
      saveTask();
      showTask();
    });
}

// 入力された内容をローカルストレージに保存する
function saveTask() {
  // 時刻をキーにして入力されたテキストと締め切りを保存する
  var formInput = {};
  var text = $("#formText").val();
  var date = $('#date').val();
  formInput.text = text;
  formInput.date = date;
  // var string = text + " " + date;
  var time = new Date();
  // 入力チェックをしてからローカルストレージに保存する
  if(checkText(text, date)) {
    localStorage.setItem(time, JSON.stringify(formInput));
    // テキストボックスを空にする
    $("#formText").val("");
    $("#date").val("");
  }
}

// ローカルストレージに保存した値を再描画する
function showTask() {
  // すでにある要素を削除する
  var table = $("table#results");
  table.children().remove();
  // ローカルストレージに保存された値すべてを要素に追加する
  var key, value = [];
  table.append(
    '<tr><th>タスク名</th><th>締め切り日</th><th>残り時間</th></tr>');
  for(var i = localStorage.length; i > -1; i--) {
    key = localStorage.key(i);
    value = localStorage.getItem(key);

    // valueがnullではないことを確認
    if (!!value) {
      text = JSON.parse(value).text;
      date = JSON.parse(value).date;
      var remain = calculateDays(date);
      // テーブルに出力
      table.append(
        '<tr><td>'
        + '<label class="checkbox-inline"><input type="checkbox" class="output" value='
        + i + '>'
        + escapeText(text) + '</label></td><td>'
        + date + '</td>'
        + '<td class="' + i + '">'
        + remain[0] + "日"
        + '</td></tr>');
      if (remain[0] < 5) {
        $('td.' + i ).addClass("time-warning");
      }
    }
  }
}

// 入力チェックを行う
function checkText(text, date) {
  // 文字数が0または20以上は不可
  if (0 === text.length || 20 < text.length) {
    alert("文字数は1〜20字にしてください");
    return false;
  }

  // 日付チェック
  if (0 === date.length) {
    alert("日付を正しく入力してください");
    return false;
  }

  // すでに入力された値があれば不可
  var length = localStorage.length;
  for (var i = 0; i < length; i++) {
    var key = localStorage.key(i);
    var value = localStorage.getItem(key);
    // 内容が一致するものがあるか比較
    if (text === JSON.parse(value).text) {
      alert("同じ内容は避けてください");
      return false;
    }
  }

  // すべてのチェックを通過できれば可
  return true;
}

// 残り時間を計算する関数
function calculateDays(dateString) {
    var date = Date.parse(dateString);
    var today = new Date();
    var diff = date - today;

    // ミリ秒から変換する
    var remainDays = Math.floor(diff / (1000*60*60*24));
    var remainHours = Math.floor((diff - 1000*60*60*24*remainDays)/ (1000*60*60));

    var remain = [remainDays, remainHours];

    return remain;
}

// タスクを削除する
function deleteTask(array){
  for (var i in array) {
    var key = localStorage.key(array[i]);
    var value = localStorage.getItem(key);
    if (!!value) {
      localStorage.removeItem(key);
    }
  }
}

// 文字列をエスケープする
function escapeText(text) {
  var TABLE_FOR_ESCAPE_HTML = {
    "&": "&amp;",
    "\"": "&quot;",
    "<": "&lt;",
    ">": "&gt;"
  };
  return text.replace(/[&"<>]/g, function(match) {
    return TABLE_FOR_ESCAPE_HTML[match];
  });
}
