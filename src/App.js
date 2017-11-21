import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {getUniqueId, setUniqueId, getId} from "./UniqueId";
import Comment from './Comment';

class App extends Component {
  constructor(props) {
    super(props);
    this.setComment = this.setComment.bind(this);
    this.addComment = this.addComment.bind(this);
    let childComments = [];
    let comments = JSON.parse(window.localStorage.getItem('comment0'));
    if (comments) {
        for (let i = 0; i < comments.length; i++) {
            childComments.push(<Comment id={comments[i].id} parentId={0} indexInParent={comments[i].indexInParent} key={comments[i].key}
                                        likes={comments[i].likes} dislikes = {comments[i].dislikes} createdAt={comments[i].createdAt}
                                        comment={comments[i].comment}/>);
            setUniqueId(Math.max(getId(), comments[i].id));
        }
    }
    this.state = {
      child: childComments
    }
  }
  setComment(event) {
    this.setState({comment: event.target.value});
  }
  addComment() {
      let key = this.state.child.length;
      let uid = getUniqueId();
      let time = new Date();
      this.setState({
          child: [...this.state.child, <Comment id={uid} parentId={0} indexInParent={key - 1} key={key} likes={0} dislikes={0}
                                                createdAt={time} comment={this.state.comment}/>]
      });
      this.refs.commentRef.value = '';
      let data = {id: uid, parentId:0, indexInParent: key - 1, likes: 0, dislikes: 0, key: key, createdAt: time, comment: this.state.comment};
      let saved = JSON.parse(window.localStorage.getItem('comment0'));
      if (saved) {
          saved.push(data);
          window.localStorage.setItem('comment0', JSON.stringify(saved));
      }
      else {
          window.localStorage.setItem('comment0', JSON.stringify([data]));
      }
  }
  render() {
    return (
        <div>
          <input ref="commentRef" className="main-input" onChange={this.setComment}/>
          <button onClick={this.addComment}>Add Comment</button>
            {this.state.child.map(function (comment){
              return comment;
            })}
        </div>
    );
  }
}

export default App;
