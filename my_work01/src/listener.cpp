#include "ros/ros.h"          // 加入ROS公用程序
#include "std_msgs/String.h"  // 所要subscribe的message header，在此是std_msgs package底下的String.msg

/* subscriber的回呼函式，參數為所接收的message的常數指標
   const pkg_name::msg_name::ConstPtr& msg
   之後使用msg->field_name即可存取message的欄位資料
*/
void chatterCallback(const std_msgs::String::ConstPtr& msg)
{
  ROS_INFO("I heard: [%s]", msg->data.c_str());
}

int main(int argc, char **argv)
{
  ros::init(argc, argv, "listener");  //一開始必須先初始化，指定node名稱為listener
  
  /* 該node與ROS系統通訊的存取點(handle)，建構子會初始化該node，
     當離開此scope，解構子會關閉該node */
  ros::NodeHandle n;
  
  /* subscribe()會將建立topic的資訊告訴master node，回傳一個Subscriber物件(在此為sub)
     指定的回呼函式名稱為chatterCallback，
     1000指的是message queue，若接收得太快，超過1000個message，新接收的message會被捨棄
  */ 
  ros::Subscriber sub = n.subscribe("chatter", 1000, chatterCallback);  

  /* ros::spin()會進入迴圈，然後呼叫所有在此執行緒(in main function)的
     回呼函式 (在此為chatterCallback)，直到Ctrl-C被輸入或當前的node被master node關掉
  */
  ros::spin();

  return 0;
}
