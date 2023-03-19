import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";
import { Task, TaskCreateDTO, TaskUpdateDTO } from "./models/task.model";
import { User } from "./models/user.model";

/**
 * This service acts as a mock backend.
 *
 * You are free to modify it as you see.
 */
function randomDelay() {
  return Math.random() * 1000;
}

@Injectable()
export class BackendService {
  storedTasks: Task[] = [
    {
      id: 0,
      title: "Install a monitor arm Install a monitor arm Install a monitor arm Install a monitor arm Install a monitor arm Install a monitor arm",
      description: "Aute laborum adipisicing aliqua laborum minim anim pariatur esse elit proident tempor reprehenderit nisi. Exercitation sit cillum velit minim ut nulla sint cupidatat velit eiusmod quis eiusmod id. Anim adipisicing aute id sit mollit. Eiusmod consequat labore est non mollit ullamco culpa consectetur.",
      assigneeId: 111,
      completed: false
    },
    {
      id: 1,
      title: "Move the desk to the new location",
      description: `
        Laboris enim irure et ea tempor sint nostrud sunt ex enim consequat amet excepteur nisi. Eiusmod sunt nostrud ullamco consequat. Non elit aliquip veniam occaecat pariatur id. Commodo ut et labore Lorem qui laboris velit est. Officia laborum tempor proident fugiat sunt ex elit. Esse in veniam sunt proident commodo labore cupidatat. Non ipsum minim culpa incididunt minim cupidatat officia.
        Velit aliquip aute nulla et dolore id proident. Ullamco id cillum magna adipisicing anim sint mollit. Fugiat Lorem minim mollit nulla id deserunt Lorem Lorem labore deserunt. Incididunt laborum occaecat in elit. Magna sit aliqua non elit excepteur qui. Duis fugiat non ea in cupidatat cupidatat tempor mollit aliqua pariatur. Ullamco laborum ex voluptate incididunt duis.
        Voluptate esse non culpa et mollit nisi laborum excepteur. Do sunt ea sint consectetur. Lorem tempor mollit anim nulla dolor culpa consequat exercitation incididunt sunt velit quis. Dolore pariatur veniam sunt do excepteur do culpa. Dolore ipsum laboris laboris veniam reprehenderit ullamco id fugiat et labore cupidatat. Quis consequat amet magna id nisi culpa ullamco aute cillum eiusmod dolore.
        Aute proident occaecat commodo qui nostrud est anim. Minim officia aliqua reprehenderit ipsum mollit minim in nulla cillum exercitation magna ex ex culpa. Laboris Lorem in enim esse eu ea magna. Occaecat sint id magna irure consequat magna tempor quis labore id nisi labore. Ullamco culpa veniam ex pariatur sint esse. Aute ad anim eu adipisicing duis deserunt reprehenderit et esse proident velit duis. Occaecat exercitation labore qui incididunt consectetur consectetur id et incididunt ex.
        Pariatur amet proident consequat ullamco sit aliquip mollit commodo officia esse Lorem. Ea fugiat minim cupidatat est esse. Elit ad consequat duis reprehenderit aliqua ex aliqua. Aliqua cillum nisi do sint est minim excepteur. Lorem ex anim reprehenderit qui voluptate enim laborum fugiat adipisicing Lorem minim nulla ad. Labore aute aute non amet tempor deserunt anim. Ad irure dolore aute adipisicing tempor in dolor dolore.
        Veniam aute voluptate incididunt officia aliquip mollit. Fugiat anim exercitation irure anim adipisicing sit. Velit sunt quis in anim voluptate ut fugiat. Aliquip et fugiat commodo est pariatur ipsum duis ea incididunt adipisicing qui.
        Ut non nulla esse voluptate labore. Excepteur nulla culpa duis consectetur sint sint Lorem do aliquip eiusmod duis aliqua. Officia et ex dolor consequat mollit cillum quis dolor Lorem ipsum magna in do. Nisi nisi amet ea laboris qui mollit et aute fugiat labore cillum ipsum culpa consequat. Culpa non minim ad reprehenderit anim adipisicing ut. Cillum elit aliquip cillum eu culpa velit eiusmod culpa.
        Adipisicing veniam aliquip incididunt eiusmod fugiat culpa cillum proident. Ea id aute cillum cillum tempor cupidatat reprehenderit sunt dolor dolor nostrud commodo esse. Irure deserunt aliquip laboris duis reprehenderit ipsum. Veniam veniam consequat adipisicing ex culpa pariatur.
        Anim officia ut commodo enim consectetur culpa reprehenderit consectetur aute sit qui laboris. Sint reprehenderit quis sunt velit eu. Occaecat aliquip Lorem anim est cillum magna consectetur amet mollit cupidatat ullamco exercitation laborum et.
        Aliquip commodo quis eu labore elit. Nisi ullamco aliquip in labore commodo ullamco cillum sint consectetur excepteur eiusmod. Consequat sint mollit pariatur adipisicing velit magna aute dolor officia sint. Est ipsum irure et laborum incididunt sunt laboris adipisicing tempor.
      `,
      assigneeId: 111,
      completed: false
    },
  ];

  storedUsers: User[] = [
    { id: 111, name: "Mike" },
    { id: 222, name: "James" }
  ];

  lastId = 1;

  private findTaskById = (id: number) => {
    const task = this.storedTasks.find(task => task.id === +id);
    if (task) {
      return task;
    }

    throw new Error('No task found');
  };

  private findUserById = (id: number) => {
    const user = this.storedUsers.find(user => user.id === +id);
    if (user) {
      return user;
    }

    throw new Error('No user found');
  };

  tasks() {
    return of(this.storedTasks).pipe(delay(randomDelay()));
  }

  task(id: number): Observable<Task> {
    return of(this.findTaskById(id)).pipe(delay(randomDelay()));
  }

  users() {
    return of(this.storedUsers).pipe(delay(randomDelay()));
  }

  user(id: number) {
    return of(this.findUserById(id)).pipe(delay(randomDelay()));
  }

  newTask(payload: TaskCreateDTO) {
    const newTask: Task = {
      id: ++this.lastId,
      title: payload.title,
      description: payload.description,
      assigneeId: null,
      completed: false
    };

    this.storedTasks = this.storedTasks.concat(newTask);

    return of(newTask).pipe(delay(randomDelay()));
  }

  assign(taskId: number, userId: number) {
    return this.update(taskId, { assigneeId: userId });
  }

  complete(taskId: number, completed: boolean) {
    return this.update(taskId, { completed });
  }

  update(taskId: number, updates: TaskUpdateDTO) {
    const foundTask = this.findTaskById(taskId);

    if (!foundTask) {
      return throwError(new Error("task not found"));
    }

    const updatedTask = { ...foundTask, ...updates };

    this.storedTasks = this.storedTasks.map(t =>
      t.id === taskId ? updatedTask : t
    );

    return of(updatedTask).pipe(delay(randomDelay()));
  }
}
