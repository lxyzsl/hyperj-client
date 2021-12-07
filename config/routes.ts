import main from './routers/main'
import system from './routers/system'
const arr : Array<any> = [];
export default arr.concat(main,system, [{
  component: './404',
}]);