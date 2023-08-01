//
//  ATTrackerConfig.h
//  Athena
//
//  Created by 李乾 on 2022/5/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// 埋点配置
@interface ATTrackerConfig : NSObject
+ (instancetype)defaultConfig;

/// 是否显示控制台日志。默认为NO。
@property (nonatomic, assign) BOOL showConsoleLog;

/// 是否是测试环境。默认为NO。
@property (nonatomic, assign) BOOL isTestEnv;

/// 上报时间间隔，单位毫秒。默认为10000毫秒，可设置最小2000毫秒。
@property (nonatomic, assign) NSTimeInterval reportTimeInterval;

/// 上报条数间隔，默认为100条。可设置最小10条，最大100条。
@property (nonatomic, assign) NSInteger reportCountInterval;

/// 数据库可存储的最大条数，单位条，如果超限则会自动删除数据库前1000条老数据。默认10000条。可设置最小10000条，最大50000条。
@property (nonatomic, assign) NSInteger dbMaxCount;

/// 数据库文件最大大小，单位MB，如果超限则会自动删除数据库前1000条老数据。默认10MB。可设置最小10MB，最大50MB。
@property (nonatomic, assign) float dbMaxSize;
@end

NS_ASSUME_NONNULL_END
