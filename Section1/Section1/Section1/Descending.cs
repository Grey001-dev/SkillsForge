namespace Section1;

public class Descending
{
    public static List<int> ReturnTarget(List<int> arr,int target)
    {
        int left = 0;
        int right = arr.Count-1;
        while (left < right)
        {
            if (arr[left] + arr[right] > target)
            {
                left++;
            }

            if (arr[left] + arr[right] < target)
            {
                right--;
            }

            if (arr[left] + arr[right] == target)
            {
                break;
            }
        }
        return [left, right];
    }
}