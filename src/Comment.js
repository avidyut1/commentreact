import React, {Component} from 'react';
import {getUniqueId, setUniqueId, getId} from "./UniqueId";

class Comment extends Component {
    constructor(props) {
        super(props);
        let childComments = [];
        let comments = JSON.parse(window.localStorage.getItem('comment' + this.props.id));
        if (comments) {
            for (let i = 0; i < comments.length; i++) {
                childComments.push(<Comment id={comments[i].id} parentId={this.props.id}
                                            indexInParent={comments[i].indexInParent} comment={comments[i].comment}
                                            likes={comments[i].likes} dislikes = {comments[i].dislikes} createdAt={comments[i].createdAt}/>);
                setUniqueId(Math.max(getId(), comments[i].id));
            }
        }
        this.state = {
            id: this.props.id,
            child: childComments,
            comment: this.props.comment,
            likes: this.props.likes,
            dislikes: this.props.dislikes,
            createdAt: this.props.createdAt,
            //control
            edit: false
        };
        this.reply = this.reply.bind(this);
        this.setReply = this.setReply.bind(this);
        this.showEdit = this.showEdit.bind(this);
    }
    reply() {
        let key = this.state.child.length;
        let uid = getUniqueId();
        let time = new Date();
        this.setState({
            child: [...this.state.child, <Comment id={uid} parentId={this.props.id} indexInParent={key - 1} key={key} likes={0} dislikes={0}
                                                  createdAt={time} comment={this.state.reply}/>]
        });
        let data = {id: uid, parentId:this.props.id, indexInParent: key - 1, likes: 0, dislikes: 0, key: key, createdAt: time, comment: this.state.reply};
        let saved = JSON.parse(window.localStorage.getItem('comment'+this.state.id));
        if (saved) {
            saved.push(data);
            window.localStorage.setItem('comment'+this.state.id, JSON.stringify(saved));
        }
        else {
            window.localStorage.setItem('comment'+this.state.id, JSON.stringify([data]));
        }
    }
    setReply(event) {
        this.setState({reply: event.target.value});
    }
    showEdit() {
        this.state.edit = true;
    }
    render () {
        return (<div>
            {this.state.edit ? <div>

            </div> : <div>
                <p>Comment - {this.state.comment} </p>
                <p>Likes - {this.state.likes} </p>
                <p>Dislikes - {this.state.dislikes}</p>
                <p>Created at - {new Date(this.state.createdAt).toString()}</p>
                <button onClick={this.showEdit}>Edit Comment</button>
                <input onChange={this.setReply}/>
                <button onClick={this.reply}>Reply</button>
            </div>}
            <div className="margin-left">
                {this.state.child.map(function (comment){
                    return comment;
                })}
            </div>
        </div>)
    }
}
export default Comment;
