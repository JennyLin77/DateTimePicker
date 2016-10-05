var leapYear = new Array("31","29","31","30","31","30","31","31","30","31","30","31");
var normalYear = new Array("31","28","31","30","31","30","31","31","30","31","30","31");
var title = new Array("日","一","二","三","四","五","六");


var dateCalendar = function(id){
    this.initialize(id);
};

dateCalendar.prototype = {
    /* 初始化 */
    initialize: function(id){
        var thisObj = this;
        this.container = document.getElementById(id);
        this.dateObj = new Date();
        this.year = this.dateObj.getFullYear();  /* 这三个是现在的年月日 */
        this.month = this.dateObj.getMonth()+1;
        this.day = this.dateObj.getDate();
        this.createContent();
        this.body = document.getElementsByTagName("body")[0];
        this.currentYear = document.getElementById("date-year");
        this.currentYearVal = parseInt(this.currentYear.innerText);   /* 日期表上的当前年份 */
        this.currentMonth = document.getElementById("date-month");
        this.currentMonthVal = parseInt(this.currentMonth.innerText);  /* 日期表上的当前月份 */
        this.prevBtn = document.getElementById("calendar-prev");
        this.nextBtn = document.getElementById("calendar-next");
        this.dateInput = document.getElementById("date");
        this.dayItem = this.calendarDay.getElementsByTagName("li");
        this.setDayList();
        this.setDateInput(this.year,this.month,this.day);

        this.prevBtn.onclick = function(){
            thisObj.prev();
        };
        this.nextBtn.onclick = function(){
            thisObj.next();
        };
        this.dateInput.onfocus = function(event){
            thisObj.calendar.style.display = "block";
            event.stopPropagation();
        }
        this.dateInput.onclick = function(event){
            thisObj.calendar.style.display = "block";
            event.stopPropagation();
        }
        this.calendar.onclick = function(event){
            thisObj.calendar.style.display = "block";
            event.stopPropagation();
        }
        this.body.onclick = function(event){
            thisObj.calendar.style.display = "none";
            event.stopPropagation();
        }
        for (var i = 0; i < this.dayItem.length; i++) {
            thisObj.dayItem[i].onclick = function(event){
                thisObj.calendar.style.display = "block";
                thisObj.clickDay(event);
                event.stopPropagation();
                return false;
            }
        }
    },
    /* 点击日期表的某一天，将所选日期显示在input框，调用setDateInput方法来将日期显示在input框中 */
    clickDay: function(event){
        var year = this.currentYearVal;
        var month = this.currentMonthVal;
        var day = event.target.innerText;
        if(event.target.className == "calendar-dayItem dim2"){
            month --;
            if (month == 0) { year--; month = 12; }
        }
        if (event.target.className == "calendar-dayItem dim1") {
            month++;
            if (month == 13) { year++; month=1; }
        }
        this.setDateInput(year,month,day);
        this.calendar.style.display = "none";
    },
    /* 将传过来的日期参数显示在input框 */
    setDateInput: function(year,month,day){
        var newMonth = month;
        if (month <10) { newMonth = "0"+newMonth; }
        var newDay = day;
        if (day < 10) { newDay = "0"+newDay; }
        var dateString = year +"-"+ newMonth +"-"+ newDay;
        this.dateInput.value = dateString;  
    },
    /* 创建日期表 */
    createContent: function(){
        this.calendar = document.createElement("div");
        this.calendar.id = "calendar";
        this.calendarContent = document.createElement("div");
        this.calendarContent.id = "calendar-content";
        this.calendarHeader = document.createElement("div");
        this.calendarHeader.id = "calendar-header";
        this.calendarHeader.innerHTML =  "<a href='##' id='calendar-prev'></a>"
                                      +  "<span id='date-div'>"
                                      +      "<span id='date-year'>"+ this.year +"</span>年"
                                      +      "<span id='date-month'>"+ this.month +"</span>月"
                                      +  "</span>"
                                      +  "<a href='##' id='calendar-next'></a>";
        this.calendarContent.appendChild(this.calendarHeader);

        this.calendarTitle = document.createElement("ul");
        this.calendarTitle.id = "calendar-title";
        this.frag1 = document.createDocumentFragment();
        for (var i = 0; i < 7; i++) {
            var liObj = document.createElement("li");
            liObj.className = "calendar-titleItem";
            liObj.innerHTML = title[i];
            this.frag1.appendChild(liObj);
        }
        this.calendarTitle.appendChild(this.frag1);
        this.calendarContent.appendChild(this.calendarTitle);

        this.calendarDay = document.createElement("ul");
        this.calendarDay.id = "calendar-day";
        this.frag2 = document.createDocumentFragment();
        for (var i = 0; i < 42; i++) {
          var  liObj = document.createElement("li");
          liObj.className = "calendar-dayItem";
          liObj.index = i;
          this.frag2.appendChild(liObj);
        }
        this.calendarDay.appendChild(this.frag2);
        this.calendarContent.appendChild(this.calendarDay);
        this.calendar.appendChild(this.calendarContent);
        this.container.appendChild(this.calendar);
    },
    /* 跳转到前一个月，调用setDayList方法刷新下面的日期 */
    prev: function(){
        this.currentMonthVal--;
        if (this.currentMonthVal == 0) {
            this.currentYearVal--;
            this.currentMonthVal = 12;
        }
        this.currentYear.innerText = this.currentYearVal;
        this.currentMonth.innerText = this.currentMonthVal;
        this.setDayList();
    },
    /* 跳转到下一个月，调用setDayList方法刷新下面的日期 */
    next: function(){
        this.currentMonthVal++;
        if (this.currentMonthVal == 13) {
            this.currentYearVal++;
            this.currentMonthVal = 1; 
        }
        this.currentYear.innerText = this.currentYearVal;
        this.currentMonth.innerText = this.currentMonthVal;
        this.setDayList();
    },
    /* 根据当前的年份和月份，刷新日期表的日期 */
    setDayList: function(){
        var y = parseInt(this.currentYearVal);
        var m = parseInt(this.currentMonthVal)-1;
        var d = parseInt(1);
        var dateTemp = new Date(y,m,d);
        var index = dateTemp.getDay();
        var oldIndex = index;
        if (this.isLeapYear()) {
            var monthArray = leapYear;
        }else{
            var monthArray = normalYear;
        }

        for (var i = 1; i <= monthArray[this.currentMonthVal-1]; i++,index++) {
            console.log(this.dayItem[index] + "--"　+ index);
            this.dayItem[index].innerHTML = i;
            this.dayItem[index].className = "calendar-dayItem";
            if (this.currentYearVal == this.year && this.currentMonthVal == this.month && i == this.day) {
                this.dayItem[index].className = "calendar-dayItem current";
            }
        }

        for (var i = 1; index < 42; i++,index++) {
            this.dayItem[index].innerHTML = i;
            this.dayItem[index].className = "calendar-dayItem dim1";
        }

        var j;
        if (this.currentMonthVal-1 == 0) { 
            j = 31; 
        }else {
            j = monthArray[this.currentMonthVal-2];
        }
        for (index = oldIndex-1; index >= 0; j--,index--) {
            this.dayItem[index].innerHTML = j;
            this.dayItem[index].className = "calendar-dayItem dim2";
        }
    },
    /* 判断当前年份是否为闰年，是的话返回true，否则返回false */
    isLeapYear: function(){
        if ((this.currentYearVal%4==0&&this.currentYearVal%100!=0)||this.currentYearVal%400==0) {
            return true;
        }else {
            return false;
        }
    }

}

window.onload = function(){
    new dateCalendar("date-container");
};