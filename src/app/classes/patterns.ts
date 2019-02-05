

export class Pattern {
  private static regionName = '^[a-zA-Z0-9][^~\"#%&*:<>?\/\\\{\}|]*$';
  private static email = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._%+-]+\.[a-zA-Z]{2,3}$';
  private static personName = '[^~\"#%&*:<>?\/\\\{\}|0-9]*$';
  private static imageExtensions = '\.(gif|jpg|jpeg|png)$';
  private static hexColors = '^#[0-9A-Fa-f]{6}$';


  static getRegionName(): string {
    return Pattern.regionName;
  }

  static getHexColors(): string {
    return Pattern.hexColors;
  }

  static getEmail(): string {
    return Pattern.email;
  }

  static getPersonName(): string {
    return Pattern.personName;
  }

  static getFileExtension(): string {
    return Pattern.imageExtensions;
  }

  constructor() { }
}
