import { combineReducers } from 'redux';
import AuthenReducer from './authen.reducer';
import MeetingReducer from './meetings.reducer';
import ResolutionReducer from './resolution.reducer';
import ErrorReducer from './errors.reducer';
import HomeReducer from './home.reducer';
import FeedbackReducer from './feedback.reducer';
import DocumentReducer from './document.reducer';
import SearchReducer from './search.reducer';
import NotificationReducer from './notification.reducer';
import WSReducer from './websocket.reducer';

export default combineReducers({
    AuthenReducer,
    MeetingReducer,
    ResolutionReducer,
    ErrorReducer,
    HomeReducer,
    FeedbackReducer,
    DocumentReducer,
    SearchReducer,
    NotificationReducer,
    WSReducer,
});
