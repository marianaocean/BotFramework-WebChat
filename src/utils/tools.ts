import { Activity } from 'botframework-directlinejs';

const removeTargets = ['TimeoutAlert', 'waitingString', 'waitingImage', 'waitingInterval', 'waitingCss'];

class CheckTool {

  static activityShouldBeRemoved(activity: Activity) {
    if (removeTargets.indexOf(activity.id) !== -1) {
      return true;
    }
    return false;
  }

}

export {
  CheckTool
};
