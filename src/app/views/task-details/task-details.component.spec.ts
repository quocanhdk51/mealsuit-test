import { TASK_SERVICE_TOKEN } from '@tokens/task.token';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { TaskStatusModule } from '@components/task-status/task-status.module';
import { UserAvatarModule } from '@components/user-avatar/user-avatar.module';

import { TaskDetailsComponent } from './task-details.component';
import { LoaderModule } from '@components/loader/loader.module';
import { MockTaskService, MOCK_TASKS } from '@test/utils/mock-task-service.service';
import { MockUserService } from '@test/utils/mock-user-service.service';
import { USER_SERVICE_TOKEN } from '@tokens/user.token';
import { NotificationModule } from '@services/notification/notification.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TaskInputDialogService } from '@components/task-input-dialog/task-input-dialog.service';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { UN_FOUND_TASK_PLACE_HOLDER } from '@component-stores/task-details.store';
import { NotificationService } from '@services/notification/notification.service';

const createSpyObj = jasmine.createSpyObj;

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let mockTaskInputDialogService: TaskInputDialogService;
  let updateTaskSpy: jasmine.Spy;
  const taskDetailId = 0;
  const updatedTitle = 'Mock title updated'

  const getElementByCssSelector =
    (selector: string): DebugElement => fixture.debugElement.query(By.css(selector));

  const mockData = () => {
    mockTaskInputDialogService = createSpyObj('TaskInputDialogService', ['updateTask']);
    updateTaskSpy = (mockTaskInputDialogService.updateTask as jasmine.Spy).and.returnValue(of({
      ...MOCK_TASKS[taskDetailId],
      title: updatedTitle,
    }));
  };

  const openMenuButton = async () => {
    const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    const menu = await loader.getHarness(MatMenuHarness.with({
      selector: '.action-btn'
    }));
    await menu.open();

    return menu;
  };

  const clickOnMenuButtonItem = async (selector: string) => {
    const menu = await openMenuButton();

    const [buttonItem] = await menu.getItems({selector});
    await buttonItem.click();
  };

  const checkMenuButtonItemDisabled = async (selector: string) => {
    const menu = await openMenuButton();

    const [buttonItem] = await menu.getItems({selector});
    const buttonItemDisabled = await buttonItem.isDisabled();
    
    expect(buttonItemDisabled).toBeTruthy();
  };

  const loadTestBed = async (taskId: number) => {
    mockData();

    await TestBed.configureTestingModule({
      declarations: [ TaskDetailsComponent ],
      imports: [
        CommonModule,
        TaskStatusModule,
        UserAvatarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
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
        }
      ]
    })
    .compileComponents();
  };

  describe('loading with valid task details id', async () => {

    beforeEach(async () => {
      await loadTestBed(taskDetailId);
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(TaskDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should load task details', () => {
      const titleElement = getElementByCssSelector('h1').nativeElement;
      expect(titleElement.textContent).toEqual(MOCK_TASKS[taskDetailId].title);
    });
  
    it('should update task', async () => {
      await clickOnMenuButtonItem('[data-testid="update-btn"]');
  
      expect(updateTaskSpy).toHaveBeenCalledWith(MOCK_TASKS[taskDetailId]);
  
      const titleElement = getElementByCssSelector('h1').nativeElement;
      expect(titleElement.textContent).toEqual(updatedTitle);
    });
  
    it('should complete task', async () => {
      const status = getElementByCssSelector('app-task-status > span.status').nativeElement;
  
      expect(status.textContent).toEqual('Not Completed');
  
      await clickOnMenuButtonItem('[data-testid="complete-btn"]');
  
      expect(status.textContent).toEqual('Completed');
  
      await checkMenuButtonItemDisabled('[data-testid="complete-btn"]');
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
      fixture = TestBed.createComponent(TaskDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not load task', () => {
      const titleElement = getElementByCssSelector('h1').nativeElement;
      expect(titleElement.textContent).toEqual(UN_FOUND_TASK_PLACE_HOLDER.title);
    });

    it('should not showing menu button', () => {
      const menuButton = getElementByCssSelector('button.action-btn');
      expect(menuButton).toBeFalsy();
    });

    it('should display notification message', () => {
      expect(notificationDisplayMessageSpy).toHaveBeenCalledWith('Task not found');
    });
  });
});
