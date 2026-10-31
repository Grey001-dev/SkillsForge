namespace Section1;

public class Target
{
    public List<int> ReturnTarget(List<int> arr,int target)
    {
        Dictionary<int, int> hash = new Dictionary<int, int>();
        int subtraction=0;
        int index=0;
        for (int i = 0; i < arr.Count; i++)
        {
            //Ill make use of a subtraction rule to search the target
            subtraction = target - arr[i];
            if (hash.ContainsKey(subtraction))
            {
                index = i;
                break;
            }
            hash[arr[i]] = i;
        }
        return [hash[subtraction], index];
    }
}