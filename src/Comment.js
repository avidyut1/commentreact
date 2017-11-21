import React, {Component} from 'react';
import {getUniqueId, setUniqueId, getId} from "./UniqueId";

class Comment extends Component {
    constructor(props) {
        super(props);
        let childComments = [];
        let comments = JSON.parse(window.localStorage.getItem('comment' + this.props.id));
        if (comments) {
            let len = comments.length;
            for (let i = 0; i < len; i++) {
                if (comments[i].deleted === true) {
                    comments.splice(i, 1);
                    len--;
                    i--;
                    continue;
                }
                childComments.push(<Comment id={comments[i].id} parentId={this.props.id} key={comments[i].key}
                                            indexInParent={i} comment={comments[i].comment} deleted={false}
                                            likes={comments[i].likes} dislikes = {comments[i].dislikes}
                                            createdAt={comments[i].createdAt}/>);
                setUniqueId(Math.max(getId(), comments[i].id));
            }
            window.localStorage.setItem('comment' + this.props.id, JSON.stringify(comments));
        }
        this.state = {
            id: this.props.id,
            child: childComments,
            comment: this.props.comment,
            likes: this.props.likes,
            dislikes: this.props.dislikes,
            createdAt: this.props.createdAt,
            //control
            edit: false,
            deleted: false
        };
        this.reply = this.reply.bind(this);
        this.setReply = this.setReply.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.setComment = this.setComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.like = this.like.bind(this);
        this.dislike = this.dislike.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteDfs = this.deleteDfs.bind(this);
    }
    reply() {
        let key = this.state.child.length;
        let uid = getUniqueId();
        let time = new Date();
        this.setState({
            child: [...this.state.child, <Comment id={uid} indexInParent={key} parentId={this.props.id} key={key} likes={0} dislikes={0}
                                                  createdAt={time} comment={this.state.reply} deleted={false}/>]
        });
        let data = {id: uid, parentId:this.props.id, likes: 0, dislikes: 0, key: key, createdAt: time, comment: this.state.reply};
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
        this.setState({edit: true});
    }
    setComment(event) {
        this.setState({comment: event.target.value});
    }
    updateComment() {
        let parentComment = JSON.parse(window.localStorage.getItem('comment' + this.props.parentId));
        let indexInParent = this.props.indexInParent;
        parentComment[indexInParent].comment = this.state.comment;
        window.localStorage.setItem('comment'+this.props.parentId, JSON.stringify(parentComment));
        this.setState({edit: false});
    }
    like() {
        let parentComment = JSON.parse(window.localStorage.getItem('comment' + this.props.parentId));
        let indexInParent = this.props.indexInParent;
        parentComment[indexInParent].likes = parentComment[indexInParent].likes + 1;
        window.localStorage.setItem('comment'+this.props.parentId, JSON.stringify(parentComment));
        this.setState({likes: parentComment[indexInParent].likes});
    }
    dislike() {
        let parentComment = JSON.parse(window.localStorage.getItem('comment' + this.props.parentId));
        let indexInParent = this.props.indexInParent;
        parentComment[indexInParent].dislikes = parentComment[indexInParent].dislikes + 1;
        window.localStorage.setItem('comment'+this.props.parentId, JSON.stringify(parentComment));
        this.setState({dislikes: parentComment[indexInParent].dislikes});
    }
    delete() {
        this.setState({deleted: true});
        let parentComment = JSON.parse(window.localStorage.getItem('comment' + this.props.parentId));
        let indexInParent = this.props.indexInParent;
        parentComment[indexInParent].deleted = true;
        window.localStorage.setItem('comment'+this.props.parentId, JSON.stringify(parentComment));
        this.deleteDfs(this.state.id);
    }
    deleteDfs(id) {
        let children = JSON.parse(window.localStorage.getItem('comment' + id));
        if (children) {
            for(let i = 0; i < children.length; i++) {
                this.deleteDfs(children[i].id);
            }
        }
        window.localStorage.removeItem('comment' + id);
    }
    render () {
        return this.props.isRootComment ? <div>
            <input onChange={this.setReply} className="main-input"/>
            <button onClick={this.reply}>Comment</button>
            <div>
                {this.state.child.map(function (comment){
                    return comment;
                })}
            </div>
        </div> : !this.state.deleted ? (<div className="margin-left">
            {this.state.edit ? <div>
                <input defaultValue={this.state.comment} onChange={this.setComment}/>
                <button onClick={this.updateComment}>Update</button>
            </div> : <div>
                <p>Comment - {this.state.comment} </p>
                <button onClick={this.like}>Like</button>
                <button onClick={this.dislike}>Dislike</button>
                <p>Likes - {this.state.likes} </p>
                <p>Dislikes - {this.state.dislikes}</p>
                <p>Created at - {new Date(this.state.createdAt).toString()}</p>
                <button onClick={this.showEdit}>Edit Comment</button>
                <input onChange={this.setReply}/>
                <button onClick={this.reply}>Reply</button>
                <button onClick={this.delete}>Delete</button>
            </div>}
            <div>
                {this.state.child.map(function (comment){
                    return comment;
                })}
            </div>
        </div>): <div></div>;
    }
}
export default Comment;
