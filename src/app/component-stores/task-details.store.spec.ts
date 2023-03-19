import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { LoaderModule } from "@components/loader/loader.module";
import { TaskInputDialogService } from "@components/task-input-dialog/task-input-dialog.service";
import { NotificationModule } from "@services/notification/notification.module";
import { MockTaskService, MOCK_TASKS } from "@test/utils/mock-task-service.service";
import { MockUserService } from "@test/utils/mock-user-service.service";
import { TASK_SERVICE_TOKEN } from "@tokens/task.token";
import { USER_SERVICE_TOKEN } from "@tokens/user.token";
import { of } from "rxjs";
import { TaskDetailsStore, UN_FOUND_TASK_PLACE_HOLDER } from "./task-details.store";
import { Task } from "@models/task.model";
import { NotificationService } from "@services/notification/notification.service";

const createSpyObj = jasmine.createSpyObj;

describe('TaskDetailsStore', () => {
    let store: TaskDetailsStore;
    let mockTaskInputDialogService: TaskInputDialogService;
    const taskDetailId = 0;
    const updatedTitle = 'Mock title updated';
    const updateTask: Task = {
        ...MOCK_TASKS[taskDetailId],
        title: updatedTitle,
    };

    const mockData = () => {
        mockTaskInputDialogService = createSpyObj('TaskInputDialogService', ['updateTask']);
        (mockTaskInputDialogService.updateTask as jasmine.Spy).and.returnValue(of({
          ...MOCK_TASKS[taskDetailId],
          title: updatedTitle,
        }));
    };

    const loadTestBed = async (taskId: number) => {
        mockData();
    
        await TestBed.configureTestingModule({
            imports: [
                LoaderModule,
                NotificationModule,
                NoopAnimationsModule
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({id: taskId}),
                    }
                },
                {
                    provide: TASK_SERVICE_TOKEN,
                    useClass: MockTaskService
                },
                {
                    provide: USER_SERVICE_TOKEN,
                    useClass: MockUserService
                },
                {
                    provide: TaskInputDialogService,
                    useValue: mockTaskInputDialogService
                },
                TaskDetailsStore
            ]
        })
        .compileComponents();
    };

    describe('loading with valid task details id', () => {
        beforeEach(async () => {
            await loadTestBed(taskDetailId);
        });

        beforeEach(() => {
            store = TestBed.inject(TaskDetailsStore);
        });

        it('should be created', () => {
            expect(store).toBeTruthy();
        });

        it('should get valid task', (done) => {
            store.task$.subscribe((task) => {
                expect(task).toEqual(MOCK_TASKS[taskDetailId]);
                done();
            });
        });

        it('should complete task', (done) => {
            store.completeTask();
            store.task$.subscribe((task) => {
                expect(task.completed).toBeTruthy();
                done();
            });
        });

        it('should update task with update dialog', (done) => {
            store.openTaskUpdateDialog();
            store.task$.subscribe((task) => {
                expect(task.title).toEqual(updatedTitle);
                done();
            });
        });

        it('should update task', (done) => {
            store.updateTask(updateTask);
            store.task$.subscribe((task) => {
                expect(task.title).toEqual(updatedTitle);
                done();
            });
        });
    });

    describe('loading with non-existing task id', () => {
        let notificationService: NotificationService;
        let notificationDisplayMessageSpy: jasmine.Spy;

        beforeEach(async () => {
            await loadTestBed(-1);
        });

        beforeEach(() => {
            notificationService = TestBed.inject(NotificationService);
            notificationDisplayMessageSpy = spyOn(notificationService, 'displayMessage').and.callThrough();
            store = TestBed.inject(TaskDetailsStore);
        });

        it('should not load task', (done) => {
            store.task$.subscribe((task) => {
                expect(task).toEqual(UN_FOUND_TASK_PLACE_HOLDER);
                done();
            });
        });

        it('should display notification message', () => {
            expect(notificationDisplayMessageSpy).toHaveBeenCalledWith('Task not found');
        });

        it('should not complete task', () => {
            store.completeTask();
            expect(notificationDisplayMessageSpy).toHaveBeenCalledWith('Task not found');
        });
    });
});
