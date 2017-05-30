var content = [];

var list = document.getElementById('list');
list.addEventListener('click', function(event) {
  if(event.target.className === 'list-container') {
    editable = -1;
    refreshList();
  }
});
var uniqueId = 0, editable;

function refreshList() {
  if(uniqueId === 0) {
    content.push({
      label: '',
      id: uniqueId++
    });
    editable = 0;
  }
  list.innerHTML = '';
  var listItems = createList(content);
  list.appendChild(listItems);
}


function createInputDiv(item, items, parent) {

  var inputElm = document.createElement('input');
  inputElm.setAttribute("type", "text");
  inputElm.value = item.label;

  setTimeout(function() {
    inputElm.focus();
  });

  inputElm.addEventListener('click', function(event){
    event.stopPropagation();
    event.preventDefault();
  });

  inputElm.addEventListener('keydown', function(event) {
      event.stopPropagation();
      var index = -1;
      if(event.keyCode === 13) {
        //onEnter
        item.label = this.value;
        items.forEach(function(obj, i) {
          if(obj.id === item.id) {
            index = i;
          }
        });
        items.splice(index+1, 0, {
          label: '',
          id: uniqueId++
        });
        editable = uniqueId - 1;
        refreshList();
      } else if(event.keyCode === 9) {
        //onTab
        if(event.shiftKey && parent) {
          //IF shift+tab is pressed
          event.preventDefault();
          editable = parent.id;
          refreshList();
        } else {
          item.label = this.value;
          if(!item.children) {
            item.children = [];
          }
          item.children.push({
            label: '',
            id: uniqueId++
          });
          editable = uniqueId - 1;
        }

        refreshList();
      } else if(event.keyCode === 8 && this.value === '') {
        //on BackSpace when empty
        items.forEach(function(obj, i) {
          if(obj.id === item.id) {
            index = i;
          }
        });
        items.splice(index , 1);
        if(items.length === 0) {
          if(!parent) {
            uniqueId = 0;
          } else {
            editable = parent.id;
          }
        } else {
          if(index !== 0) {
            editable = items[index - 1].id;
          } else {
            editable = items[index].id;
          }
        }

        refreshList();
      }
  });

  inputElm.addEventListener('keyup', function(event) {
    item.label = this.value;
  });
  return inputElm;
}


function createList(listItems, parent) {
  if(listItems && listItems.length > 0) {
    var ul = document.createElement('ul');
    listItems.forEach(function(item) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      if(editable !== item.id) {
        span.innerHTML = item.label;
      } else {
        span.appendChild(createInputDiv(item, listItems, parent));
      }
      li.appendChild(span);
      li.addEventListener('click', function(event){
        event.stopPropagation();
        event.preventDefault();
        editable = item.id;
        refreshList();
      });

      li.addEventListener('mouseover', function(event) {
        event.stopPropagation();
        event.preventDefault();
        li.classList.add('selected');
      });
      li.addEventListener('mouseout', function(event) {
        event.stopPropagation();
        event.preventDefault();
        li.classList.remove('selected');
      });

      // append all nested nodes
      var childrenDiv = createList(item.children, item);
      if(childrenDiv) {
        li.appendChild(childrenDiv);
      }
      ul.appendChild(li);
    });
    return ul;
  }
  return null;
}
