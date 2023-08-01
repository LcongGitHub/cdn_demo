//
//  AthenaTrack.h
//  Athena
//
//  Created by 李乾 on 2022/5/24.
//

#import <Foundation/Foundation.h>
#import <Athena/ATTrackerConfig.h>

NS_ASSUME_NONNULL_BEGIN

@class AthenaTracker;
@protocol AthenaTrackerDelegate <NSObject>
/// appId注册完毕回调。一般来说你不用关注这个回调，除非你想知道appId有没有注册成功。
- (void)trackerDidInitializedWithAppId:(NSString *)appId;
@end


@interface AthenaTracker : NSObject
/*!
 sdk初始化方法
 @param config 埋点相关配置，一般来说使用[ATTrackerConfig defaultConfig]即可。
 @param delegate appId注册完毕回调
 */
+ (void)initializeWithConfig:(ATTrackerConfig *)config delegate:(nullable id<AthenaTrackerDelegate>)delegate;
+ (nullable ATTrackerConfig *)config;

/*!
 @abstract 设置用户协议同意状态。从用户隐私角度出发，如果用户不同意隐私政策，sdk内部并不会对埋点数据进行统计上报。
 @param agreed 用户是否同意。
 @param completion 用户选择同意/不同意之后，sdk内部会做一定的上报或者清理操作。清理操作完成后会回调completion。
 @discussion 你最好在sdk初始化(initialize)后，且在注册appid(registAppId:isHost:extra:)之前调用这个方法。
 @discussion 你需要在每次app launch后都要调用该方法。类似于处理隐私协议弹窗，你需要在appdelegate中先判断隐私协议是否已经同意过，如果同意过则调用该方法且agree传YES；如果没有同意过，则会弹出隐私协议弹窗，在用户选择同意时调用该方法且agree传YES，在用户选择不同意时调用该方法且agree传NO，在收到completion后处理App的退出操作。
 @discussion 如果你用户选择“不同意”，则最好在收到completion回调后再执行退出App的操作，不然会损失一定的埋点数据。
 ===================== 示例 =====================
 - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
     // ...
     // sdk初始化
     ATTrackerConfig *config =  [ATTrackerConfig defaultConfig];
     [AthenaTracker initializeWithConfig:config delegate:nil];
     
     BOOL userPolicyAgreed = 从本地读取用户协议同意状态;
     if (userPolicyAgreed) { // 如果用户已经同意过了
         [AthenaTracker setUserPrivacyPolicyAgreed:YES completion:^{
             [AthenaTracker registerAppId:@"xxx" isHost:YES extra:nil]; // 注册相关的appId
         }];
         // App进入主页面
     } else { // 弹出隐私协议弹窗
         // 弹窗，回调agreed
         if (agreed) { // 用户同意
             [AthenaTracker setUserPrivacyPolicyAgreed:YES completion:^{
                 [AthenaTracker registerAppId:@"xxx" isHost:YES extra:nil]; // 注册相关的appId
             }];
             // 本地存储用户同意状态
             // App进入主页面
         } else { // 用户拒绝
             [AthenaTracker setUserPrivacyPolicyAgreed:NO completion:^{
                 exit(0); // 退出App
             }];
         }
     }
     //...
 }
 */
+ (void)setUserPrivacyPolicyAgreed:(BOOL)agreed completion:(nullable void(^)(void))completion;

/*!
 注册appId，可调用多次来注册多个appId
 @param appId 应用id
 @param isHost 是否是宿主。如果是Application调用初始化函数，需要设置isHost为true。如果是library(比如广告、支付、推送等功能性SDK），需要设置isHost为false。对于isHost为true的模块，Athena SDK会自动采集并上报Crash信息
 @param extra 应用的其他信息
 @discussion 注册属于必要的操作，如果你没有注册任何appId，则将不会有任何埋点能够上报。
 */
+ (void)registerAppId:(NSString *)appId isHost:(BOOL)isHost extra:(nullable NSDictionary *)extra;

/*!
 如果接入方有账号体系的话，可在账号登录后调用此接口传入账号id和账号类型。
 @param accountUid 账号id
 @param accountType 账号类型，业务方自定义
 */
+ (void)setAccountUid:(NSString *)accountUid accountType:(int)accountType;

/*!
 埋点
 @param eventName 埋点名称
 @param appId 应用id
 @param data 埋点数据
 @discussion appId跟registAppId:isHost:extra:中的appId是一一对应的。如果你在调用此方法之前没有注册appId，则此埋点将无效。
 */
+ (void)trackEventName:(NSString *)eventName appId:(NSString *)appId data:(nullable NSDictionary *)data;

/*!
 添加或删除业务公参
 */
+ (void)setPublicParamsWithKey:(NSString *)key value:(nullable id)value;

/// sdk版本号
+ (NSString*)sdkVersion;

@end

NS_ASSUME_NONNULL_END
