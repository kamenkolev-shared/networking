interface _ILayer<T> {
  encapsulate?: (data: _ILayer<any>["PDU"]) => T;
  decapsulate?: (data: _ILayer<any>["PDU"]) => T;
  PDU: T;
}

interface ILayer<
  T,
  ParentLayer extends _ILayer<any> | null,
  ChildLayer extends _ILayer<any> | null
> {
  encapsulate?: ParentLayer extends null
    ? null
    : (SDU: ParentLayer["PDU"]) => T;
  decapsulate?: ChildLayer extends null ? null : (IDK: ChildLayer["PDU"]) => T;
  PDU: T;
}

/**
 * Application layer -> HTTP, DNS
 */
type Layer7 = ILayer<Data, null, Layer6>;

/**
 * Presentational layer (OS, file extensions?)
 */
type Layer6 = ILayer<Data, Layer7, Layer5>;

/**
 * Session (data to binary?)
 * PDU is binary
 */
type Layer5 = ILayer<Data, Layer6, Layer4>;

/**
 * Transport (deals with routing the given data to software running on the system)
 * It uses ports to do this
 * It adds two ports to the header (sender/receiver)
 * TCP/UDP?
 * PDU is segment
 */
type Layer4 = ILayer<Segment | Datagram, Layer5, Layer3>;

/**
 * Networking (deals with adresses) (IP is here)
 * Segment + Header(used to identify end devices (sender and receiver)) = Packet
 * PDU is packet
 */
type Layer3 = ILayer<Packet, Layer4, Layer2>;

/**
 * Data link
 * PDU is frame
 * the frame has both a header and a trailer( they are both just signals which as super non-random so that we can tell when a packet begins and ends. As opposed to static electricity and noise and shit)
 * Example - Ethernet protocol (tells us when a frame begins and ends)
 * Has 2 sub-layers
 *  Logical layer (Logical link control = LLC)
 *  MAC layer
 */
type Layer2 = ILayer<Frame, Layer3, Layer1>;

/**
 * Physical
 * frame => electrical signal
 */
type Layer1 = ILayer<_Symbol, Layer2, null>;

type Data = any;

type Segment = [{ srcPort: number; desPort: number }, Data];
type Datagram = unknown;

type Packet = [{ ipStuff: unknown }, ...Segment];
type Frame = [{ header: unknown }, ...Packet, { trailer: unknown }];
type _Symbol = unknown;
