using Section1;

var descending = Descending.ReturnTarget([15, 11, 7, 2], 9);
Console.WriteLine($"Descending: ({descending[0]}, {descending[1]})");

var target = new Target();
var unsorted = target.ReturnTarget([2, 7, 11, 15], 9);
Console.WriteLine($"Unsorted: ({unsorted[0]}, {unsorted[1]})");